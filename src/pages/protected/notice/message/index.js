import React from "react";
import { useTranslation } from "react-i18next";
import MessageCard from "components/surface/MessageCard";
import { _getMessages } from "utils/firebase/notice";
import { useAuthContext } from "utils/auth";
import { db } from "utils/firebase";
import {
    onSnapshot,
    query,
    collection,
    collectionGroup,
    where,
    getDoc,
    doc,
    orderBy,
    limit,
    getDocs,
} from "firebase/firestore";
import { useNavigateContext } from "utils/navigate";

const Message = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuthContext();
    const navigate = useNavigateContext();
    const [lastMessages, setLastMessages] = React.useState({});
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "FETCH_ROOMS_PENDING":
                    return {
                        roomsLoading: true,
                    };
                case "FETCH_ROOMS_FULFILLED":
                    return {
                        roomsLoading: false,
                        rooms: action.payload?.docs,
                    };
                case "FETCH_ROOMS_REJECTED":
                    return {
                        roomsLoading: false,
                    };
            }
        },
        {
            roomsLoading: false,
            rooms: [],
        }
    );

    React.useEffect(() => {
        if (!Boolean(userInfo?.id)) return;
        dispatch({
            type: "FETCH_ROOMS_PENDING",
        });

        const participantsRef = collectionGroup(db, "participants");
        const participantsQuery = query(
            participantsRef,
            where("id", "==", userInfo?.id),
            orderBy("createdAt", "desc")
        );

        let observers = [];
        const unsubscribe = onSnapshot(participantsQuery, (querySnapshot) => {
            const rooms = [];
            const roomTasks = [];
            observers.forEach((f) => f());
            observers = [];
            querySnapshot.forEach((docSnapshot) => {
                const parentRef = docSnapshot.ref.parent.parent;
                const parentDocId = parentRef.id;
                roomTasks.push(
                    getDoc(parentRef).then((parentDocSnapshot) => {
                        rooms.push({
                            id: parentDocId,
                            title: parentDocSnapshot.data()?.title,
                            thumbnailUrl:
                                parentDocSnapshot.data()?.thumbnailUrl,
                        });
                    })
                );

                const sendsRef = collection(db, `${parentRef.path}/sends`);
                const sendQuery = query(
                    sendsRef,
                    orderBy("createdAt", "desc"),
                    limit(1)
                );
                observers.push(
                    onSnapshot(sendQuery, (parentSendsQuerySnapshot) => {
                        parentSendsQuerySnapshot.forEach(
                            (parentSendsDocsSnapshot) => {
                                setLastMessages({
                                    [parentDocId]: {
                                        id: parentSendsDocsSnapshot.id,
                                        ...parentSendsDocsSnapshot.data(),
                                    },
                                });
                            }
                        );
                    })
                );
            });

            Promise.all(roomTasks)
                .then(() => {
                    dispatch({
                        type: "FETCH_ROOMS_FULFILLED",
                        payload: {
                            docs: rooms,
                        },
                    });
                })
                .catch((e) => {
                    console.dir(e);
                    dispatch({
                        type: "FETCH_ROOMS_REJECTED",
                    });
                });
        });

        return () => {
            unsubscribe();
        };
    }, [userInfo?.id]);

    return (
        <div className="pages-protected-notice-message">
            <ul className="messages">
                {(state.rooms || []).map((message, idx) => (
                    <li key={idx}>
                        <MessageCard
                            onClick={() => {
                                navigate.push({
                                    pathname: `/notice/${message?.id}`,
                                    mode: "sub",
                                });
                            }}
                            thumbnailUrl={message?.thumbnailUrl}
                            title={message?.title}
                            lastMessage={lastMessages?.[message?.id]}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Message;

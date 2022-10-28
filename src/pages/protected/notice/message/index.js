import React from "react";
import { useTranslation } from "react-i18next";
import MessageCard from "components/surface/MessageCard";
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
    const lastMessagesRef = React.useRef({});
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            let rooms = [];
            switch (action.type) {
                case "FETCH_ROOMS_PENDING":
                    return {
                        ...state,
                        roomsLoading: true,
                    };
                case "FETCH_ROOMS_FULFILLED":
                    rooms = action.payload?.docs || [];

                    return {
                        ...state,
                        roomsLoading: false,
                        rooms,
                    };
                case "FETCH_ROOMS_REJECTED":
                    return {
                        ...state,
                        roomsLoading: false,
                    };
                case "FETCH_LAST_MESSAGE":
                    const parentDocId = action.payload?.parentDocId;
                    const lastMessage = action.payload?.lastMessage || {};

                    rooms = state.rooms;
                    const idx = rooms.findIndex((x) => x.id === parentDocId);

                    if (idx >= 0) {
                        rooms[idx].lastMessage = lastMessage;
                    }
                    rooms.sort(
                        (a, b) =>
                            b.lastMessage?.createdAt?.toDate() -
                            a.lastMessage?.createdAt?.toDate()
                    );

                    return {
                        ...state,
                        rooms,
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
            const roomTasks = [];
            observers.forEach((f) => f());
            observers = [];

            querySnapshot.forEach((docSnapshot) => {
                const parentRef = docSnapshot.ref.parent.parent;
                roomTasks.push(getDoc(parentRef));
            });

            Promise.all(roomTasks)
                .then((parentDocSnapshots) => {
                    const rooms = [];
                    for (const parentDocSnapshot of parentDocSnapshots) {
                        const parentDoc = {
                            id: parentDocSnapshot.id,
                            ...parentDocSnapshot.data(),
                        };
                        rooms.push(parentDoc);

                        const sendsRef = collection(
                            db,
                            `messages/${parentDocSnapshot.id}/sends`
                        );
                        const sendQuery = query(
                            sendsRef,
                            orderBy("createdAt", "desc"),
                            limit(1)
                        );
                        observers.push(
                            onSnapshot(
                                sendQuery,
                                (parentSendsQuerySnapshot) => {
                                    let lastMessage = null;
                                    parentSendsQuerySnapshot.forEach(
                                        (parentSendsDocsSnapshot) => {
                                            lastMessage = {
                                                id: parentSendsDocsSnapshot.id,
                                                ...parentSendsDocsSnapshot.data(),
                                            };
                                        }
                                    );

                                    dispatch({
                                        type: "FETCH_LAST_MESSAGE",
                                        payload: {
                                            parentDocId: parentDocSnapshot.id,
                                            lastMessage: lastMessage,
                                        },
                                    });
                                }
                            )
                        );
                    }

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
                    <li key={message.id}>
                        <MessageCard
                            onClick={() => {
                                navigate.push({
                                    pathname: `/notice/${message?.id}`,
                                    mode: "sub",
                                });
                            }}
                            rid={message.id}
                            thumbnailUrl={message?.thumbnailUrl}
                            title={message?.title}
                            lastMessage={message?.lastMessage}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Message;

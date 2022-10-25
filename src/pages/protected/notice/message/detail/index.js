import React from "react";
import { useParams } from "react-router-dom";
import {
    onSnapshot,
    collection,
    query,
    orderBy,
    limit,
} from "firebase/firestore";
import { db } from "utils/firebase";
import { useNavigateContext } from "utils/navigate";
import { _getRoomInfo } from "utils/firebase/notice";
import { ReactComponent as PlusIcon } from "assets/images/icons/message/plus.svg";
import { ReactComponent as SendIcon } from "assets/images/icons/message/send.svg";
import WoilonnInput from "components/input/WoilonnInput";

const NoticeMessageDetail = ({ type }) => {
    const { rid } = useParams();
    const navigate = useNavigateContext();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "FETCH_ROOM_INFO_PENDING":
                    return {
                        ...state,
                        roomInfoLoading: true,
                    };
                case "FETCH_ROOM_INFO_FULFILLED":
                    return {
                        ...state,
                        roomInfoLoading: false,
                        roomInfo: action.payload?.doc,
                    };
                case "FETCH_ROOM_INFO_REJECTED":
                    return {
                        ...state,
                        roomInfoLoading: false,
                    };
                case "MESSAGES_ADDED":
                    return {
                        ...state,
                    };
                case "MESSAGES_REMOVED":
                    return {
                        ...state,
                    };
                case "MESSAGES_MODIFIED":
                    return {
                        ...state,
                    };
                case "CLEAR_MESSAGE":
                    return {
                        ...state,
                        type: "",
                    };
                case "TYPE_MESSAGE":
                    return {
                        ...state,
                        type: action.payload?.value,
                    };
            }
        },
        {
            roomInfoLoading: false,
            roomInfo: null,
            messagesLoading: false,
            messages: [],
            type: "",
        }
    );

    React.useLayoutEffect(() => {
        navigate.setLayout({
            screenTitle: state.roomInfo?.title,
        });
    }, [state.roomInfo]);

    React.useEffect(() => {
        if (!rid) return;

        dispatch({
            type: "FETCH_ROOM_INFO_PENDING",
        });
        _getRoomInfo({ rid })
            .then((doc) => {
                dispatch({
                    type: "FETCH_ROOM_INFO_FULFILLED",
                    payload: {
                        doc,
                    },
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "FETCH_ROOM_INFO_REJECTED",
                });
            });
    }, [rid]);

    React.useEffect(() => {
        if (!rid) return;

        const sendsRef = collection(db, `messages/${rid}/sends`);
        const sendsQuery = query(
            sendsRef,
            orderBy("createdAt", "desc"),
            limit(10)
        );
        const unsubscribe = onSnapshot(sendsQuery, (querySnapshot) => {
            const docs = [];
            querySnapshot.docChanges().forEach((change) => {
                switch (change.type) {
                    case "added":
                        dispatch({
                            type: "MESSAGES_ADDED",
                            payload: {
                                docs: change.doc.data(),
                            },
                        });
                        break;
                    case "modified":
                        dispatch({
                            type: "MESSAGES_MODIFIED",
                        });
                        break;
                    case "removed":
                        dispatch({
                            type: "MESSAGES_REMOVED",
                        });
                        break;
                }
            });
        });

        return () => unsubscribe();
    }, []);

    const onSubmitHandler = React.useCallback(() => {
        if (!Boolean(state.type)) return;
        console.log("d submit", state.type);
        dispatch({
            type: "CLEAR_MESSAGE",
        });
    }, [state.type]);

    return (
        <main className="protected-notice-message-detail">
            <div className="messages">
                <ul>
                    {(state.messages || []).map((message, idx) => (
                        <li key={idx}>{message.message}</li>
                    ))}
                </ul>
            </div>
            <div className="type">
                <div className="plus-icon">
                    <PlusIcon />
                </div>
                <div className="input-container">
                    <input
                        value={state.type}
                        onChange={(event) =>
                            dispatch({
                                type: "TYPE_MESSAGE",
                                payload: {
                                    value: event.target.value,
                                },
                            })
                        }
                        onKeyPress={(event) => {
                            if (!Boolean(state.type)) return;
                            if (event.key === "Enter") {
                                dispatch({
                                    type: "TYPE_MESSAGE",
                                    payload: {},
                                });
                            }
                        }}
                    />
                </div>

                {Boolean(state.type) && (
                    <div className="send-icon" onClick={onSubmitHandler}>
                        <SendIcon />
                    </div>
                )}
            </div>
        </main>
    );
};

export default NoticeMessageDetail;

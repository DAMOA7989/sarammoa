import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
    onSnapshot,
    collection,
    query,
    orderBy,
    limit,
} from "firebase/firestore";
import { db } from "utils/firebase";
import { useNavigateContext } from "utils/navigate";
import { _getRoomInfo, _createRoom, _sendMessage } from "utils/firebase/notice";
import { ReactComponent as PlusIcon } from "assets/images/icons/message/plus.svg";
import { ReactComponent as SendIcon } from "assets/images/icons/message/send.svg";
import WoilonnInput from "components/input/WoilonnInput";
import { useAuthContext } from "utils/auth";

const NoticeMessageDetail = ({ type }) => {
    const { rid } = useParams();
    const [search] = useSearchParams();
    const navigate = useNavigateContext();
    const { userInfo } = useAuthContext();
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
        if (!rid || rid === "new") return;

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
            querySnapshot.docChanges().forEach((change) => {
                console.log("d doc", change.type, change.doc.data());
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

        if (rid === "new") {
            _createRoom(search.get("from"), search.get("to"))
                .then((docId) => {
                    _sendMessage({
                        rid: docId,
                        uid: userInfo?.id,
                        message: state.type,
                    })
                        .then(() => {
                            navigate.replace({
                                pathname: `/notice/${docId}`,
                                mode: "sub",
                            });
                        })
                        .catch((e) => {
                            console.dir(e);
                        });
                })
                .catch((e) => {
                    console.dir(e);
                });
        } else {
            _sendMessage({
                rid,
                uid: userInfo?.id,
                message: state.type,
            })
                .then(() => {})
                .catch((e) => {
                    console.dir(e);
                });
        }
        dispatch({
            type: "CLEAR_MESSAGE",
        });
    }, [rid, state.type]);

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
                                onSubmitHandler();
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

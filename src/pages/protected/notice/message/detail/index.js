import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
    onSnapshot,
    collection,
    query,
    orderBy,
    limit,
    startAfter,
} from "firebase/firestore";
import { db } from "utils/firebase";
import { useNavigateContext } from "utils/navigate";
import {
    _getRoomInfo,
    _createRoom,
    _sendMessage,
    _getParticipantInfos,
} from "utils/firebase/notice";
import { ReactComponent as PlusIcon } from "assets/images/icons/message/plus.svg";
import { ReactComponent as SendIcon } from "assets/images/icons/message/send.svg";
import { useAuthContext } from "utils/auth";
import { intersection } from "utils/operator";
import LazyImage from "components/surface/LazyImage";
import LazyTypography from "components/surface/LazyTypography";
import { displayDate } from "utils/string";

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
                case "INCREASE_PAGE":
                    return {
                        ...state,
                        page: state.page + 1,
                    };
                case "DECREASE_PAGE":
                    return {
                        ...state,
                        page: state.page - 1,
                    };
                case "FETCH_PARTICIPANTS_PENDING":
                    return {
                        ...state,
                        participantsLoading: true,
                    };
                case "FETCH_PARTICIPANTS_FULFILLED":
                    return {
                        ...state,
                        participantsLoading: false,
                        participants: action.payload?.participants,
                    };
                case "FETCH_PARTICIPANTS_REJECTED":
                    return {
                        ...state,
                        participantsLoading: false,
                    };
                case "FETCH_MESSAGES":
                    const addedDocs = action.payload?.addedDocs || [];
                    const modifiedDocs = action.payload?.modifiedDocs || [];
                    const removedDocs = action.payload?.removedDocs || [];

                    let docs = [...state.messages, ...addedDocs];

                    // const docIds = docs.map((x) => x.id);
                    // const docIdsSet = new Set(docIds);
                    // const removedDocIds = removedDocs.map((x) => x.id);
                    // const removedDocIdsSet = new Set(removedDocIds);
                    // const intersectionSet = intersection(
                    //     docIdsSet,
                    //     removedDocIdsSet
                    // );
                    // const intersectionArray = Array.from(intersectionSet);
                    // docs = docs.filter(
                    //     (x) => !intersectionArray.includes(x.id)
                    // );

                    docs.sort((a, b) => {
                        return a.createdAt.toDate() - b.createdAt.toDate();
                    });

                    return {
                        ...state,
                        init: true,
                        messages: docs,
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
            init: false,
            roomInfoLoading: false,
            roomInfo: null,
            participantsLoading: false,
            participants: {},
            messagesLoading: false,
            messages: [],
            page: 0,
            offset: 20,
            type: "",
        }
    );
    const scrollObserverRef = React.useRef(
        new IntersectionObserver((entries, observer) => {
            if (entries?.[0].intersectionRatio === 1) {
                canScrollToEndRef.current = true;
            } else {
                canScrollToEndRef.current = false;
            }
        }, {})
    );
    const infiniteScrollObserverRef = React.useRef(
        new IntersectionObserver((entries) => {
            if (entries?.[0].intersectionRatio === 1 && initRef.current) {
                dispatch({
                    type: "INCREASE_PAGE",
                });
            }
        }, {})
    );
    const initRef = React.useRef(false);
    const prevScrollHeightRef = React.useRef(0);
    const containerRef = React.useRef(null);
    const canScrollToEndRef = React.useRef(false);
    const messagesStartRef = React.useRef(null);
    const messagesEndRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const unsubscribesRef = React.useRef([]);

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
        dispatch({
            type: "FETCH_PARTICIPANTS_PENDING",
        });
        _getParticipantInfos({
            rid,
        })
            .then((participants) => {
                dispatch({
                    type: "FETCH_PARTICIPANTS_FULFILLED",
                    payload: {
                        participants,
                    },
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "FETCH_PARTICIPANTS_REJECTED",
                });
            });
    }, [rid]);

    React.useEffect(() => {
        if (!rid || rid === "new") return;

        const sendsRef = collection(db, `messages/${rid}/sends`);
        let sendsQuery = null;
        if (state.page === 0) {
            unsubscribesRef.current.forEach((f) => f());
            unsubscribesRef.current = [];
            sendsQuery = query(
                sendsRef,
                orderBy("createdAt", "desc"),
                limit(state.offset)
            );
        } else {
            sendsQuery = query(
                sendsRef,
                orderBy("createdAt", "desc"),
                startAfter(state.messages[0].docSnapshot),
                limit(state.offset)
            );
        }

        const unsubscribe = onSnapshot(sendsQuery, (querySnapshot) => {
            const addedDocs = [];
            const modifiedDocs = [];
            const removedDocs = [];
            querySnapshot.docChanges().forEach((change) => {
                switch (change.type) {
                    case "added":
                        addedDocs.push({
                            docSnapshot: change.doc,
                            id: change.doc.id,
                            ...change.doc.data(),
                        });
                        break;
                    case "modified":
                        modifiedDocs.push({
                            docSnapshot: change.doc,
                            id: change.doc.id,
                            ...change.doc.data(),
                        });
                        break;
                    case "removed":
                        removedDocs.push({
                            docSnapshot: change.doc,
                            id: change.doc.id,
                            ...change.doc.data(),
                        });
                        break;
                }
            });

            dispatch({
                type: "FETCH_MESSAGES",
                payload: {
                    addedDocs,
                    modifiedDocs,
                    removedDocs,
                },
            });
        });
        unsubscribesRef.current.push(unsubscribe);

        containerRef.current.scrollTop =
            containerRef.current.scrollHeight - prevScrollHeightRef.current;
        prevScrollHeightRef.current = containerRef.current.scrollHeight;
    }, [rid, state.page]);

    React.useEffect(() => {
        scrollObserverRef.current.observe(messagesEndRef.current);
        infiniteScrollObserverRef.current.observe(messagesStartRef.current);
    }, []);

    const scrollToEnd = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    React.useEffect(() => {
        if (!state.messages.length) return;

        if (canScrollToEndRef.current) {
            scrollToEnd();
        }
        if (state.messages.length >= state.offset) {
            initRef.current = true;
        }
    }, [state.messages]);

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
                .then(() => {
                    scrollToEnd();
                })
                .catch((e) => {
                    console.dir(e);
                });
        }
        dispatch({
            type: "CLEAR_MESSAGE",
        });
    }, [rid, state.type]);

    return (
        <main ref={containerRef} className="protected-notice-message-detail">
            <div className="messages">
                <ul>
                    <div ref={messagesStartRef} />
                    {(state.messages || []).map((message, idx) => {
                        return (
                            <li key={idx}>
                                <div
                                    className={`container ${
                                        state.messages?.[idx - 1]?.sender ===
                                        message.sender
                                            ? ""
                                            : "new"
                                    }`}
                                >
                                    <div
                                        className={`sender-profile-thumbnail`}
                                        onClick={() =>
                                            navigate.push({
                                                pathname: `/user/${message.sender}`,
                                                mode: "sub",
                                            })
                                        }
                                    >
                                        {message.sender !== userInfo?.id && (
                                            <LazyImage
                                                src={
                                                    state.participants?.[
                                                        message.sender
                                                    ]?.profileThumbnailUrl
                                                }
                                                alt="sender profile thumbnail"
                                            />
                                        )}
                                    </div>
                                    <div
                                        className={`message-container ${
                                            message.sender === userInfo?.id
                                                ? "right"
                                                : "left"
                                        }`}
                                    >
                                        {state.messages?.[idx - 1]?.sender !==
                                            message.sender && (
                                            <span className="nickname">
                                                <LazyTypography
                                                    width={60}
                                                    fontSize={"0.875rem"}
                                                >
                                                    {
                                                        state.participants?.[
                                                            message.sender
                                                        ]?.nickname
                                                    }
                                                </LazyTypography>
                                            </span>
                                        )}
                                        <div
                                            className={`message`}
                                            data-createdAt={displayDate(
                                                "hh:mm",
                                                message.createdAt.toDate()
                                            )}
                                        >
                                            {message.message}
                                        </div>
                                    </div>
                                    <div className="sender-profile-thumbnail">
                                        {message.sender === userInfo?.id && (
                                            <LazyImage
                                                src={
                                                    state.participants?.[
                                                        message.sender
                                                    ]?.profileThumbnailUrl
                                                }
                                                alt="sender profile thumbnail"
                                            />
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </ul>
            </div>
            <div className="type">
                <div className="plus-icon">
                    <PlusIcon />
                </div>
                <div className="input-container">
                    <input
                        ref={inputRef}
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
                                event.preventDefault();
                                event.stopPropagation();
                                inputRef.current.focus();
                                onSubmitHandler();
                            }
                        }}
                    />
                </div>

                {Boolean(state.type) && (
                    <div
                        className="send-icon"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            inputRef.current.focus();
                            onSubmitHandler();
                        }}
                    >
                        <SendIcon />
                    </div>
                )}
            </div>
        </main>
    );
};

export default NoticeMessageDetail;

import React from "react";
import { db } from "utils/firebase";
import {
    doc,
    getDoc,
    collection,
    collectionGroup,
    orderBy,
    query,
    onSnapshot,
    where,
    limit,
} from "firebase/firestore";

const StoreContext = React.createContext(null);

export const StoreProvider = ({ children }) => {
    const subscribe = ({
        path,
        query: _query = {
            type: null,
            args: [null, null, null],
        },
        callback,
    }) => {
        let unsubscribe = null;
        switch ((path || "").split("/").length % 2) {
            case 0:
                unsubscribe = onSnapshot(doc(db, path), (docSnapshot) => {
                    if (callback)
                        callback({
                            payload: docSnapshot.data(),
                        });
                });
                break;
            case 1:
                const collectionRef = collection(db, path);
                let q = null;
                switch (_query?.type) {
                    case "where":
                        q = query(
                            collectionRef,
                            where(
                                _query?.args?.[0],
                                _query?.args?.[1],
                                _query?.args?.[2]
                            )
                        );
                        break;
                    default:
                        q = collectionRef;
                        break;
                }

                unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const datas = [];
                    querySnapshot.forEach((docSnapshot) => {
                        datas.push({
                            id: docSnapshot.id,
                            ...docSnapshot.data(),
                        });
                    });

                    if (callback)
                        callback({
                            payload: datas,
                        });
                });
                break;
        }

        return unsubscribe;
    };

    const unsubscribe = ({ unsubscribe: _unsubscribe }) => {
        return _unsubscribe?.();
    };

    const [messagesState, messagesDispatch] = React.useReducer(
        (state, action) => {
            let rooms = [];
            switch (action.type) {
                case "FETCH_ROOMS_PENDING":
                    return {
                        ...state,
                        roomsLoading: true,
                    };
                case "FETCH_ROOMS_FULFILLED":
                    return {
                        ...state,
                        roomsLoading: false,
                        rooms: action.payload?.docs || [],
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

    const messages = {
        state: messagesState,
        observe: ({ uid }) => {
            messagesDispatch({
                type: "FETCH_ROOMS_PENDING",
            });
            const participantsRef = collectionGroup(db, "participants");
            const participantsQuery = query(
                participantsRef,
                where("id", "==", uid),
                orderBy("createdAt", "desc")
            );

            let observers = [];
            const unsubscribe = onSnapshot(
                participantsQuery,
                (querySnapshot) => {
                    const roomTasks = [];
                    observers.forEach((f) => f());
                    observers = [];

                    querySnapshot.forEach((docSnapshot) => {
                        roomTasks.push(getDoc(docSnapshot.ref.parent.parent));
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
                                                (parentSendsDocSnapshot) => {
                                                    lastMessage = {
                                                        id: parentSendsDocSnapshot.id,
                                                        ...parentSendsDocSnapshot.data(),
                                                    };
                                                }
                                            );

                                            messagesDispatch({
                                                type: "FETCH_LAST_MESSAGE",
                                                payload: {
                                                    parentDocId:
                                                        parentDocSnapshot.id,
                                                    lastMessage,
                                                },
                                            });
                                        }
                                    )
                                );
                            }

                            messagesDispatch({
                                type: "FETCH_ROOMS_FULFILLED",
                                payload: {
                                    docs: rooms,
                                },
                            });
                        })
                        .catch((e) => {
                            console.dir(e);
                            messagesDispatch({
                                type: "FETCH_ROOMS_REJECTED",
                            });
                        });
                }
            );

            return () => {
                observers.forEach((f) => f());
                unsubscribe();
            };
        },
    };

    const value = {
        subscribe,
        unsubscribe,
        messages,
    };

    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
};

export const useStoreContext = () => React.useContext(StoreContext);

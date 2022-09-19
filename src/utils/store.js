import React from "react";
import { db } from "utils/firebase";
import { doc, collection, query, onSnapshot, where } from "firebase/firestore";

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

    const value = {
        subscribe,
        unsubscribe,
    };

    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
};

export const useStoreContext = () => React.useContext(StoreContext);

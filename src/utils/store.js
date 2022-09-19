import React from "react";
import { db } from "utils/firebase";
import { doc, collection, query, onSnapshot, where } from "firebase/firestore";

const StoreContext = React.createContext(null);

export const StoreProvider = ({ children }) => {
    const [_docs, _setDocs] = React.useState([]);
    const [docs, setDocs] = React.useState([]);

    const subscribe = ({
        path,
        query: _query = {
            type: null,
            args: [null, null, null],
        },
        setData,
    }) => {
        let unsubscribe = null;
        switch ((path || "").split("/").length % 2) {
            case 0:
                unsubscribe = onSnapshot(doc(db, path), (docSnapshot) => {
                    if (setData) {
                        setData({
                            id: docSnapshot.id,
                            ...docSnapshot.data(),
                        });
                    }
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

                    if (setData) {
                        setData(datas);
                    }
                });
                break;
        }

        return unsubscribe;
    };

    const unsubscribe = ({ unsubscribe: _unsubscribe }) => {
        return _unsubscribe?.();
    };

    const value = {
        docs,
        subscribe,
        unsubscribe,
    };

    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
};

export const useStoreContext = () => React.useContext(StoreContext);

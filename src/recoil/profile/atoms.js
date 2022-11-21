import { atomFamily, DefaultValue, selector } from "recoil";
import {
    getWritingIds,
    getWriting,
    updateWriting,
} from "utils/firebase/writing";
import {
    collection,
    query,
    onSnapshot,
    orderBy,
    getDocs,
    where,
    doc,
} from "firebase/firestore";
import { db } from "utils/firebase";

export const writingIdsState = atomFamily({
    key: "writingIdsState",
    default: () => [],
    effects: (uid) => [
        ({ setSelf }) => {
            const writingsRef = collection(db, "writings");
            let q = query(writingsRef, where("writer", "==", uid));
            q = query(q, orderBy("createdAt", "desc"));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const addDocs = [];
                const removeDocs = [];
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        // setSelf((prev) => [change.doc.id, ...prev]);
                        addDocs.push(change.doc.id);
                    }

                    if (change.type === "removed") {
                        // setSelf((prev) =>
                        //     prev.filter((x) => x !== change.doc.id)
                        // );
                        removeDocs.push(change.doc.id);
                    }
                });
                setSelf((prev) => {
                    let cur = [...addDocs, ...prev];
                    removeDocs.forEach((removeDoc) => {
                        cur = cur.filter((x) => x !== removeDoc);
                    });
                    return cur;
                });
            });

            return unsubscribe;
        },
    ],
});

export const writingInfoState = atomFamily({
    key: "writingInfoState",
    default: (id) =>
        selector({
            key: "writingInfoState/default",
            get: async () => {
                return await getWriting(id);
            },
        }),
    effects: (id) => [
        // ({ onSet }) => {
        //     onSet(async (newValues, oldValues) => {
        //         if (
        //             !newValues ||
        //             !oldValues ||
        //             oldValues instanceof DefaultValue ||
        //             newValues === oldValues
        //         ) {
        //             return;
        //         }
        //         try {
        //             await updateWriting(id, { ...newValues });
        //         } catch (e) {
        //             console.dir(e);
        //         }
        //     });
        // },
    ],
});

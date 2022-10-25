import { db, storage } from "./index";
import {
    doc,
    collection,
    setDoc,
    addDoc,
    getDoc,
    Timestamp,
    query,
    where,
    getDocs,
    collectionGroup,
    writeBatch,
    runTransaction,
} from "firebase/firestore";
import { intersectionSet } from "utils/operator";

export const _getRoomInfo = ({ rid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const roomRef = doc(db, `messages/${rid}`);
            const roomSnapshot = await getDoc(roomRef);

            if (roomSnapshot.exists()) {
                return resolve({
                    id: roomSnapshot.id,
                    ...roomSnapshot.data(),
                });
            } else {
                throw new Error(`There is no room(id: ${rid})`);
            }
        } catch (e) {
            return reject(e);
        }
    });

export function _searchWithParticipants() {
    return new Promise(async (resolve, reject) => {
        try {
            const uids = [];

            for (const arg of arguments) {
                uids.push(arg);
            }

            const participantsRef = collectionGroup(db, "participants");

            let parentIds = [];
            for (const [idx, uid] of uids.entries()) {
                const _parentIds = [];
                const participantsQuery = query(
                    participantsRef,
                    where("id", "==", uid)
                );

                const participantsQuerySnapshot = await getDocs(
                    participantsQuery
                );
                participantsQuerySnapshot.forEach((participantSnapshot) => {
                    const parentRef = participantSnapshot.ref.parent.parent;
                    _parentIds.push(parentRef.id);
                });

                if (idx === 0) {
                    parentIds = _parentIds;
                } else {
                    const prevSet = new Set(parentIds);
                    const curSet = new Set(_parentIds);

                    const intersectSet = intersectionSet(prevSet, curSet);
                    parentIds = Array.from(intersectSet);
                }
            }

            return resolve(parentIds || []);
        } catch (e) {
            return reject(e);
        }
    });
}

export function _createRoom() {
    return new Promise(async (resolve, reject) => {
        try {
            let rid = null;
            await runTransaction(db, async (transaction) => {
                const timestampNow = Timestamp.now();
                const messagesRef = collection(db, "messages");
                const messageDocRef = await addDoc(messagesRef, {
                    type: "direct",
                    updatedAt: timestampNow,
                    createdAt: timestampNow,
                });
                rid = messageDocRef.id;

                for (const uid of arguments) {
                    const messageParticipantsRef = doc(
                        db,
                        `messages/${rid}/participants/${uid}`
                    );
                    transaction.set(messageParticipantsRef, {
                        id: uid,
                        createdAt: timestampNow,
                    });
                }
            });

            return resolve(rid);
        } catch (e) {
            return reject(e);
        }
    });
}

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
} from "firebase/firestore";

export const _getMessages = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const messagesRef = collection(db, "messages");
            const q = query(
                messagesRef,
                where("participants", "array-contains", uid)
            );

            const querySnapshot = await getDocs(q);
            let docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            return resolve({ docs });
        } catch (e) {
            return reject(e);
        }
    });
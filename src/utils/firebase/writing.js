import { db, storage, functions } from "./index";
import {
    doc,
    collection,
    setDoc,
    Timestamp,
    getDoc,
    query,
    getDocs,
    where,
    orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { getResizedImageBlob } from "utils/converter";
import { v4 as uuidv4 } from "uuid";

export const _post = ({
    uid,
    contents = [],
    cover = null,
    title = "",
    searchTags = [],
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const docId = uuidv4();

            const newContents = [];
            for (const [idx, content] of contents.entries()) {
                let _content = content;
                if (content instanceof File) {
                    const blob = await getResizedImageBlob(content);
                    const contentRef = ref(storage, `writings/${docId}/${idx}`);
                    await uploadBytes(contentRef, blob);
                    _content = await getDownloadURL(contentRef);
                }
                newContents.push(_content);
            }

            let _cover = null;
            if (cover && cover instanceof Blob) {
                const blob = await getResizedImageBlob(cover, 300, 300);
                const coverRef = ref(storage, `writings/${docId}/cover`);
                await uploadBytes(coverRef, blob);
                _cover = await getDownloadURL(coverRef);
            }

            await setDoc(
                doc(db, `writings/${docId}`),
                {
                    writer: uid,
                    contents: newContents,
                    cover: _cover,
                    title,
                    searchTags,
                    createdAt: Timestamp.now(),
                },
                {
                    merge: true,
                }
            );

            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _getUserWritings = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            if (!Boolean(uid)) throw new Error("uid is undefined");

            const writingsRef = collection(db, "writings");
            let q = query(writingsRef, where("writer", "==", uid));
            q = query(q, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            const docs = [];
            querySnapshot.forEach((docSnapshot) => {
                docs.push({
                    id: docSnapshot.id,
                    ...docSnapshot.data(),
                });
            });
            return resolve({
                docs,
            });
        } catch (e) {
            return reject(e);
        }
    });

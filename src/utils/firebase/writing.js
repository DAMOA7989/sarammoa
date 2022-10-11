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
    addDoc,
    deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { getResizedImageBlob } from "utils/converter";
import { v4 as uuidv4 } from "uuid";

export const _isOwner = ({ uid, wid }) =>
    new Promise(async (resolve, reject) => {
        try {
            if (!Boolean(uid) || !Boolean(wid))
                throw new Error("uid or wid is empty");

            const writingRef = doc(db, "writings", wid);
            const writingSnapshot = await getDoc(writingRef);

            if (!writingSnapshot.exists()) {
                throw new Error("empty doc");
            }

            const writingInfo = writingSnapshot.data();

            if (uid !== writingInfo?.writer) {
                throw new Error("user is not a owner of this writing");
            }

            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

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
                if (content.type === "photo") {
                    const photo = content.value;
                    const blob = await getResizedImageBlob(photo);
                    const contentRef = ref(storage, `writings/${docId}/${idx}`);
                    await uploadBytes(contentRef, blob);
                    _content = {
                        type: "photo",
                        value: await getDownloadURL(contentRef),
                    };
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
                    published: true,
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

export const _delete = ({ uid, wid }) =>
    new Promise(async (resolve, reject) => {
        try {
            await _isOwner({ uid, wid });

            const writingRef = doc(db, "writings", wid);
            await deleteDoc(writingRef);
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _getUserWritings = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            if (!Boolean(uid)) throw new Error("uid is null");

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

export const _getWritingDetail = ({ wid }) =>
    new Promise(async (resolve, reject) => {
        try {
            if (!Boolean(wid)) throw new Error("wid is null");

            const docRef = doc(db, `writings`, wid);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const writingInfo = {
                    id: docSnapshot.id,
                    ...docSnapshot.data(),
                };

                const writerId = writingInfo?.writer;
                if (!Boolean(writerId)) throw new Error("writer is empty");

                const writerDocRef = doc(db, "users", writerId);
                const writerDocSnapshot = await getDoc(writerDocRef);

                if (writerDocSnapshot.exists()) {
                    const writerInfo = {
                        id: writerDocSnapshot.id,
                        ...writerDocSnapshot.data(),
                    };

                    writingInfo.writer = writerInfo;
                } else {
                    throw new Error("writer info is empty");
                }

                const commentsRef = collection(db, `writings/${wid}/comments`);
                const commentsQuery = query(
                    commentsRef,
                    orderBy("createdAt", "desc")
                );
                const commentsQuerySnapshot = await getDocs(commentsQuery);
                const comments = [];
                commentsQuerySnapshot.forEach((docSnapshot) => {
                    comments.push({
                        id: docSnapshot.id,
                        ...docSnapshot.data(),
                    });
                });
                writingInfo.comments = comments;

                const likesRef = collection(db, `writings/${wid}/likes`);
                const likesQuery = query(
                    likesRef,
                    orderBy("createdAt", "desc")
                );
                const likesQuerySnapshot = await getDocs(likesQuery);
                const likes = [];
                likesQuerySnapshot.forEach((docSnapshot) => {
                    likes.push({
                        id: docSnapshot.id,
                        ...docSnapshot.data(),
                    });
                });
                writingInfo.likes = likes;

                const viewsRef = collection(db, `writings/${wid}/views`);
                const viewsQuery = query(
                    viewsRef,
                    orderBy("createdAt", "desc")
                );
                const viewsQuerySnapshot = await getDocs(viewsQuery);
                const views = [];
                viewsQuerySnapshot.forEach((docSnapshot) => {
                    views.push({
                        id: docSnapshot.id,
                        ...docSnapshot.data(),
                    });
                });
                writingInfo.views = views;

                return resolve(writingInfo);
            } else {
                throw new Error("doc is empty");
            }
        } catch (e) {
            return reject(e);
        }
    });

export const _leaveComment = ({ wid, uid, message }) =>
    new Promise(async (resolve, reject) => {
        try {
            const commentsRef = collection(db, `writings/${wid}/comments`);
            await addDoc(commentsRef, {
                writer: uid,
                message,
                createdAt: Timestamp.now(),
            });
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _switchPublishedField = ({ uid, wid }) =>
    new Promise(async (resolve, reject) => {
        try {
            await _isOwner({ uid, wid });

            const writingRef = doc(db, "writings", wid);
            const writingSnapshot = await getDoc(writingRef);

            if (writingSnapshot.exists()) {
                const published = writingSnapshot.data()?.published;

                await setDoc(
                    writingRef,
                    {
                        published: !published,
                    },
                    { merge: true }
                );
            } else {
                throw new Error("doc is empty");
            }

            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

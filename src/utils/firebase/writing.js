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
    limit,
    startAfter,
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
                const _id = uuidv4();
                let _content = {
                    id: _id,
                    ...content,
                };
                if (content.type === "photo") {
                    const blob = await getResizedImageBlob(content.value);
                    const contentRef = ref(
                        storage,
                        `writings/${docId}/${_content.id}`
                    );
                    await uploadBytes(contentRef, blob);
                    _content = {
                        ..._content,
                        type: "photo",
                        value: await getDownloadURL(contentRef),
                    };
                }
                newContents.push(_content);
            }

            let _cover = null;
            if (cover instanceof Blob) {
                const blob = await getResizedImageBlob(cover, 480, 480);
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

export const _update = ({
    uid,
    wid,
    contents = [],
    cover = null,
    title = "",
    searchTags = [],
}) =>
    new Promise(async (resolve, reject) => {
        try {
            await _isOwner({ uid, wid });

            const newContents = [];
            for (const [idx, content] of contents.entries()) {
                const _id = uuidv4();
                let _content = {
                    id: _id,
                    ...content,
                };
                if (content.type === "photo") {
                    if (content.value instanceof Blob) {
                        const blob = await getResizedImageBlob(content.value);
                        const contentRef = ref(
                            storage,
                            `writings/${wid}/${_content.id}`
                        );
                        await uploadBytes(contentRef, blob);
                        _content = {
                            ..._content,
                            type: "photo",
                            value: await getDownloadURL(contentRef),
                        };
                    }
                }
                newContents.push(_content);
            }
            const updateData = {
                title,
                searchTags,
                contents: newContents,
                updatedAt: Timestamp.now(),
            };

            if (cover instanceof Blob) {
                const blob = await getResizedImageBlob(cover, 480, 480);
                const coverRef = ref(storage, `writings/${wid}/cover`);
                await uploadBytes(coverRef, blob);
                updateData.cover = await getDownloadURL(coverRef);
            }

            await setDoc(doc(db, `writings/${wid}`), updateData, {
                merge: true,
            });

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

export const _getWritings = ({ uid, lastVisible, limit: _limit = 5 }) =>
    new Promise(async (resolve, reject) => {
        try {
            const writingsRef = collection(db, "writings");
            let docs = [];
            if (!Boolean(uid)) {
                let writingsQuery = null;
                if (lastVisible) {
                    writingsQuery = query(
                        writingsRef,
                        orderBy("createdAt", "desc"),
                        startAfter(lastVisible),
                        limit(_limit)
                    );
                } else {
                    writingsQuery = query(
                        writingsRef,
                        orderBy("createdAt", "desc"),
                        limit(_limit)
                    );
                }
                const querySnapshot = await getDocs(writingsQuery);

                querySnapshot.forEach((docSnapshot) => {
                    docs.push({
                        id: docSnapshot.id,
                        ...docSnapshot.data(),
                    });
                });
            } else {
                const followingIds = [uid];
                const followingRef = collection(db, `users/${uid}/following`);
                const querySnapshot = await getDocs(followingRef);
                querySnapshot.forEach((docSnapshot) =>
                    followingIds.push(docSnapshot.id)
                );

                const dbPromises = [];
                for (const followingId of followingIds) {
                    let writingsQuery = null;
                    if (lastVisible) {
                        writingsQuery = query(
                            writingsRef,
                            where("writer", "==", followingId),
                            orderBy("createdAt", "desc"),
                            startAfter(lastVisible),
                            limit(_limit)
                        );
                    } else {
                        writingsQuery = query(
                            writingsRef,
                            where("writer", "==", followingId),
                            orderBy("createdAt", "desc"),
                            limit(_limit)
                        );
                    }
                    dbPromises.push(getDocs(writingsQuery));
                }

                const beforeFilteringDocs = [];
                await Promise.all(dbPromises).then((writingsQuerySnapshots) => {
                    writingsQuerySnapshots.forEach((writingsQuerySnapshot) => {
                        writingsQuerySnapshot.forEach((docSnapshot) => {
                            beforeFilteringDocs.push({
                                id: docSnapshot.id,
                                ...docSnapshot.data(),
                            });
                        });
                    });
                });

                beforeFilteringDocs.sort((a, b) => {
                    const aDate = a.createdAt.toDate();
                    const bDate = b.createdAt.toDate();
                    return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
                });

                docs = beforeFilteringDocs.slice(0, _limit);
            }

            return resolve({
                docs,
            });
        } catch (e) {
            return reject(e);
        }
    });

export const _scrap = ({ uid, wid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const scrapRef = doc(db, `users/${uid}/scraps/${wid}`);
            const scrapSnapshot = await getDoc(scrapRef);

            if (scrapSnapshot.exists()) {
                throw new Error("already exist");
            }

            await setDoc(
                scrapRef,
                {
                    createdAt: Timestamp.now(),
                },
                { merge: true }
            );
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _report = ({ uid, wid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const type = "writing";
            const reportRef = collection(db, "reports");
            let alreadyCheckQuery = query(reportRef, where("uid", "==", uid));
            alreadyCheckQuery = query(
                alreadyCheckQuery,
                where("wid", "==", wid)
            );
            alreadyCheckQuery = query(
                alreadyCheckQuery,
                where("type", "==", type)
            );

            const aleradyCheckQuerySnapshot = await getDocs(alreadyCheckQuery);
            const alreadyDocs = [];
            aleradyCheckQuerySnapshot.forEach((docSnapshot) => {
                alreadyDocs.push({ id: docSnapshot.id, ...docSnapshot.data() });
            });
            if (alreadyDocs.length > 0) {
                throw new Error("already exist");
            }

            await addDoc(reportRef, {
                type,
                uid,
                wid,
                createdAt: Timestamp.now(),
            });
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _like = ({ uid, wid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const writingLikeRef = doc(db, `writings/${wid}/likes/${uid}`);
            await setDoc(
                writingLikeRef,
                {
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

export const _dislike = ({ uid, wid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const writingLikeRef = doc(db, `writings/${wid}/likes/${uid}`);
            await deleteDoc(writingLikeRef);

            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _view = ({ uid, wid }) =>
    new Promise(async (resolve, reject) => {
        try {
            try {
                await _isOwner({ uid, wid });
                throw new Error("You are owner of this writing");
            } catch (e) {
                if (e.message === "You are owner of this writing") {
                    throw new Error("You are owner of this writing");
                }
            }

            const writingViewsRef = collection(db, `writings/${wid}/views`);
            await addDoc(writingViewsRef, {
                uid,
                createdAt: Timestamp.now(),
            });

            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _countTotalLikes = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const writingsRef = collection(db, "writings");
            const writingsQuery = query(
                writingsRef,
                where("writer", "==", uid)
            );

            const writingsQuerySnapshot = await getDocs(writingsQuery);
            const likesTasks = [];
            writingsQuerySnapshot.forEach((writingDocSnapshot) => {
                const likesRef = collection(
                    db,
                    `writings/${writingDocSnapshot.id}/likes`
                );
                likesTasks.push(getDocs(likesRef));
            });

            const likes = [];
            await Promise.all(likesTasks).then((result) => {
                for (const querySnapshot of result) {
                    querySnapshot.forEach((docSnapshot) => {
                        likes.push({
                            id: docSnapshot.id,
                            ...docSnapshot.data(),
                        });
                    });
                }
            });

            return resolve(likes);
        } catch (e) {
            return reject(e);
        }
    });

export const _countTotalViews = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const writingsRef = collection(db, "writings");
            const writingsQuery = query(
                writingsRef,
                where("writer", "==", uid)
            );

            const writingsQuerySnapshot = await getDocs(writingsQuery);
            const viewsTasks = [];
            writingsQuerySnapshot.forEach((writingDocSnapshot) => {
                const viewsRef = collection(
                    db,
                    `writings/${writingDocSnapshot.id}/views`
                );
                viewsTasks.push(getDocs(viewsRef));
            });

            const views = [];
            await Promise.all(viewsTasks).then((result) => {
                for (const querySnapshot of result) {
                    querySnapshot.forEach((docSnapshot) => {
                        views.push({
                            id: docSnapshot.id,
                            ...docSnapshot.data(),
                        });
                    });
                }
            });

            return resolve(views);
        } catch (e) {
            return reject(e);
        }
    });

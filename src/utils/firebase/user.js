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
    runTransaction,
    writeBatch,
} from "firebase/firestore";

export const _isFollow = ({ from, to }) =>
    new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, `users/${from}/following/${to}`);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            return reject(e);
        }
    });

export const _follow = ({ from, to }) =>
    new Promise(async (resolve, reject) => {
        try {
            if (!Boolean(from) || !Boolean(to)) {
                throw new Error("from of to field is empty");
            }

            if (from === to) {
                throw new Error("From and to are same.");
            }

            const batch = writeBatch(db);

            const fromUserFollowingRef = doc(
                db,
                `users/${from}/following/${to}`
            );
            batch.set(fromUserFollowingRef, {
                createdAt: Timestamp.now(),
            });

            const toUserFollowersRef = doc(db, `users/${to}/followers/${from}`);
            batch.set(toUserFollowersRef, {
                createdAt: Timestamp.now(),
            });

            await batch.commit();
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _unfollow = ({ from, to }) =>
    new Promise(async (resolve, reject) => {
        try {
            if (!Boolean(from) || !Boolean(to)) {
                throw new Error("from of to field is empty");
            }

            if (from === to) {
                throw new Error("From and to are same.");
            }

            const batch = writeBatch(db);

            const fromUserFollowingRef = doc(
                db,
                `users/${from}/following/${to}`
            );
            batch.delete(fromUserFollowingRef);

            const toUserFollowersRef = doc(db, `users/${to}/followers/${from}`);
            batch.delete(toUserFollowersRef);

            await batch.commit();
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _report = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const type = "user";
            const reportsRef = collection(db, "reports");
            let aleradyCheckQuery = query(
                reportsRef,
                where("type", "==", type)
            );
            aleradyCheckQuery = query(
                aleradyCheckQuery,
                where("uid", "==", uid)
            );

            const aleradyCheckQuerySnapshot = await getDocs(aleradyCheckQuery);
            const alreadyDocs = [];
            aleradyCheckQuerySnapshot.forEach((docSnapshot) => {
                alreadyDocs.push({ id: docSnapshot.id, ...docSnapshot.data() });
            });
            if (alreadyDocs.length > 0) {
                throw new Error("already exist");
            }

            await addDoc(reportsRef, {
                type,
                uid,
                createdAt: Timestamp.now(),
            });
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

const _getFollowing = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const collectionRef = collection(db, `users/${uid}/following`);
            const querySnapshot = await getDocs(collectionRef);

            const docs = [];
            querySnapshot.forEach((docSnapshot) => {
                docs.push({
                    id: docSnapshot.id,
                    ...docSnapshot.data(),
                });
            });
            return resolve(docs);
        } catch (e) {
            return reject(e);
        }
    });

const _getFollowers = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const collectionRef = collection(db, `users/${uid}/followers`);
            const querySnapshot = await getDocs(collectionRef);

            const docs = [];
            querySnapshot.forEach((docSnapshot) => {
                docs.push({
                    id: docSnapshot.id,
                    ...docSnapshot.data(),
                });
            });
            return resolve(docs);
        } catch (e) {
            return reject(e);
        }
    });

export const _getFollowInfos = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const docs = {};

            const tasks = [];
            tasks.push(
                _getFollowing({ uid }).then((following) => {
                    docs.following = following || [];
                })
            );
            tasks.push(
                _getFollowers({ uid }).then((followers) => {
                    docs.followers = followers || [];
                })
            );
            await Promise.all(tasks);
            return resolve(docs);
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

export const _getTotalComments = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const writingsRef = collection(db, "writings");
            const writingsQuery = query(
                writingsRef,
                where("writer", "==", uid)
            );

            const writingsQuerySnapshot = await getDocs(writingsQuery);
            const commentsTasks = [];
            writingsQuerySnapshot.forEach((writingDocSnapshot) => {
                const commentsRef = collection(
                    db,
                    `writings/${writingDocSnapshot.id}/comments`
                );
                commentsTasks.push(getDocs(commentsRef));
            });

            const comments = [];
            await Promise.all(commentsTasks).then((result) => {
                for (const querySnapshot of result) {
                    querySnapshot.forEach((docSnapshot) => {
                        comments.push({
                            id: docSnapshot.id,
                            ...docSnapshot.data(),
                        });
                    });
                }
            });

            return resolve(comments);
        } catch (e) {
            return reject(e);
        }
    });

export const _getTotalProfileViews = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const userProfileViewsRef = collection(
                db,
                `users/${uid}/profileViews`
            );
            const userProfileViewsQuery = query(
                userProfileViewsRef,
                orderBy("createdAt", "desc")
            );
            const userProfileViewsQuerySnapshot = await getDocs(
                userProfileViewsQuery
            );
            const profileViews = [];
            userProfileViewsQuerySnapshot.forEach(
                (userProfileViewDocSnapshot) => {
                    profileViews.push({
                        id: userProfileViewDocSnapshot.id,
                        ...userProfileViewDocSnapshot.data(),
                    });
                }
            );

            return resolve(profileViews);
        } catch (e) {
            return reject(e);
        }
    });

export const _viewProfile = ({ fromUid, toUid }) =>
    new Promise(async (resolve, reject) => {
        try {
            if (fromUid === toUid) {
                throw new Error("You are watching your profile");
            }

            const userProfileViewsRef = collection(
                db,
                `users/${toUid}/profileViews`
            );
            await addDoc(userProfileViewsRef, {
                uid: fromUid,
                createdAt: Timestamp.now(),
            });

            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _getUsers = ({ limit: _limit = 100 }) =>
    new Promise(async (resolve, reject) => {
        try {
            const usersRef = collection(db, "users");
            const usersQuery = query(
                usersRef,
                orderBy("createdAt", "desc"),
                limit(_limit)
            );
            const usersQuerySnapshot = await getDocs(usersQuery);

            const users = [];
            usersQuerySnapshot.forEach((userDocSnapshot) => {
                users.push({
                    id: userDocSnapshot.id,
                    ...userDocSnapshot.data(),
                });
            });

            return resolve(users);
        } catch (e) {
            return reject(e);
        }
    });

export const _getUsersWithSearch = ({
    search,
    lastDocSnapshot,
    limit: _limit = 100,
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const usersRef = collection(db, "users");

            let usersQuery = null;
            if (!Boolean(search)) {
                if (!lastDocSnapshot) {
                    usersQuery = query(
                        usersRef,
                        orderBy("createdAt", "desc"),
                        limit(_limit)
                    );
                } else {
                    usersQuery = query(
                        usersRef,
                        orderBy("createdAt", "desc"),
                        startAfter(lastDocSnapshot),
                        limit(_limit)
                    );
                }
            } else {
                usersQuery = query(
                    usersRef,
                    orderBy("nickname", "asc"),
                    where("nickname", ">=", search),
                    where("nickname", "<=", search + "\uf8ff")
                );
            }

            const usersQuerySnapshot = await getDocs(usersQuery);

            const users = [];
            usersQuerySnapshot.forEach((userDocSnapshot) => {
                users.push({
                    docSnapshot: userDocSnapshot,
                    id: userDocSnapshot.id,
                    ...userDocSnapshot.data(),
                });
            });

            return resolve(users);
        } catch (e) {
            return reject(e);
        }
    });

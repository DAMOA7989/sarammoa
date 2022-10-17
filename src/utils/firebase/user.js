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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { getResizedImageBlob } from "utils/converter";
import { v4 as uuidv4 } from "uuid";

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

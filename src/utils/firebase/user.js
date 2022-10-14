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

import { app, auth, db } from "./index";
import {
    getAuth,
    signInWithRedirect,
    GoogleAuthProvider,
    getRedirectResult,
    signOut,
} from "firebase/auth";
import { doc, collection, setDoc, addDoc, getDoc } from "firebase/firestore";

export const _getRedirectResult = async () => await getRedirectResult(auth);

export const _signInWithRedirect = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
};

export const _signOut = () =>
    new Promise(async (resolve, reject) => {
        try {
            await signOut(auth);
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _setUserInfo = ({ uid, payload }) =>
    new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "users", uid);
            await setDoc(docRef, { ...payload }, { merge: true });
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _getUserInfo = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return resolve({
                    id: docSnap.id,
                    ...docSnap.data(),
                });
            } else {
                throw new Error();
            }
        } catch (e) {
            return reject(e);
        }
    });

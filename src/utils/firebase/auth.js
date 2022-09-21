import { auth, db, storage, functions } from "./index";
import {
    getAuth,
    signInWithRedirect,
    signInWithCustomToken,
    GoogleAuthProvider,
    getRedirectResult,
    signOut,
} from "firebase/auth";
import {
    doc,
    collection,
    setDoc,
    addDoc,
    getDoc,
    Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { httpsCallable } from "firebase/functions";

export const _getRedirectResult = async () => await getRedirectResult(auth);

export const _logAccess = ({ uid }) =>
    new Promise(async (resolve, reject) => {
        try {
            await setDoc(
                doc(db, "users", uid),
                {
                    accessedAt: Timestamp.now(),
                },
                {
                    replace: true,
                }
            );
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _signInWithRedirect = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
};

export const _signInWithCustomToken = ({ token }) =>
    new Promise(async (resolve, reject) => {
        try {
            await signInWithCustomToken(auth, token);
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

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
            await setDoc(
                docRef,
                { ...payload, updatedAt: Timestamp.now() },
                { merge: true }
            );
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

export const _uploadProfileThumbnail = ({ uid, profileThumbnailBlob }) =>
    new Promise(async (resolve, reject) => {
        try {
            const profileThumbnailRef = ref(storage, `${uid}/profileThumbnail`);
            await uploadBytes(profileThumbnailRef, profileThumbnailBlob);
            const url = await getDownloadURL(profileThumbnailRef);
            return resolve({ url });
        } catch (e) {
            return reject(e);
        }
    });

export const _getAccessTokenWithKakao = ({ code, redirect_uri }) =>
    new Promise(async (resolve, reject) => {
        try {
            const getAccessTokenWithKakao = httpsCallable(
                functions,
                "caller-auth-getAccessTokenWithKakao"
            );
            getAccessTokenWithKakao({
                code,
                redirect_uri,
            }).then(
                ({
                    data: {
                        access_token,
                        token_type,
                        refresh_token,
                        refresh_token_expires_in,
                        expires_in,
                        scope,
                    },
                }) => {
                    return resolve({
                        accessToken: access_token,
                        refreshToken: refresh_token,
                    });
                }
            );
        } catch (e) {
            return reject(e);
        }
    });

export const _createFirebaseToken = ({ accessToken }) =>
    new Promise(async (resolve, reject) => {
        try {
            const createFirebaseToken = httpsCallable(
                functions,
                "caller-auth-createFirebaseToken"
            );

            console.log("Kakao access_token: ", accessToken);
            const { data: firebaseToken } = await createFirebaseToken({
                accessToken,
            });
            return resolve({
                firebaseToken,
            });
        } catch (e) {
            console.dir(e);
            return reject(e);
        }
    });

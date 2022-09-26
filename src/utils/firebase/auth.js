import { auth, db, storage, functions } from "./index";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithRedirect,
    signInWithCustomToken,
    GoogleAuthProvider,
    getRedirectResult,
    signOut,
    sendPasswordResetEmail,
    verifyPasswordResetCode,
    confirmPasswordReset,
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
                    merge: true,
                }
            );
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _createUserWithEmailAndPassword = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _signInWithEmailAndPassword = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
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
            return reject(e);
        }
    });

export const _sendVerificationEmail = ({ code, email }) =>
    new Promise(async (resolve, reject) => {
        try {
            const sendVerificationEmail = httpsCallable(
                functions,
                "caller-auth-sendVerificationEmail"
            );

            const { data: messageId } = await sendVerificationEmail({
                code,
                toAddress: email,
            });
            return resolve(messageId);
        } catch (e) {
            return reject(e);
        }
    });

export const _sendPasswordResetEmail = ({ email }) =>
    new Promise(async (resolve, reject) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const _verifyPasswordResetCode = ({ actionCode }) =>
    new Promise(async (resolve, reject) => {
        try {
            const email = await verifyPasswordResetCode(auth, actionCode);
            return resolve(email);
        } catch (e) {
            return reject(e);
        }
    });

export const _confirmPasswordReset = ({ actionCode, newPassword }) =>
    new Promise(async (resolve, reject) => {
        try {
            await verifyPasswordResetCode(auth, actionCode);
            const resp = await confirmPasswordReset(
                auth,
                actionCode,
                newPassword
            );
            return resolve(resp);
        } catch (e) {
            return reject(e);
        }
    });

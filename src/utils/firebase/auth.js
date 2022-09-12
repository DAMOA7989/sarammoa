import { app, auth } from "./index";
import {
    getAuth,
    signInWithRedirect,
    GoogleAuthProvider,
    getRedirectResult,
    signOut,
} from "firebase/auth";

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

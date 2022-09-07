import { app, auth } from "./index";
import {
    getAuth,
    signInWithRedirect,
    GoogleAuthProvider,
    getRedirectResult,
} from "firebase/auth";

export const _signInWithRedirect = () =>
    new Promise(async (resolve, reject) => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
            return resolve(true);
        } catch (e) {
            return reject(e);
        }
    });

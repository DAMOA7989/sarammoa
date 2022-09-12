import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { _signInWithRedirect, _signOut } from "utils/firebase/auth";
import { auth } from "utils/firebase";
import { useStatusContext } from "utils/status";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
    const { task } = useStatusContext();
    const [init, setInit] = React.useState(false);
    const [user, setUser] = React.useState({
        status: "idle",
        payload: {},
    });

    React.useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            setInit(true);
            window.sessionStorage.removeItem("sm_sign_in");
            task.finish();
            if (user) {
                setUser({
                    status: "fulfilled",
                    payload: {
                        user,
                    },
                });
            } else {
                setUser({
                    status: "rejected",
                    payload: {},
                });
            }
        });
    }, []);

    React.useEffect(() => {
        if (!init) {
            if (Boolean(window.sessionStorage.getItem("sm_sign_in"))) {
                setInit(true);
                setUser({
                    status: "pending",
                    payload: {
                        provider: window.sessionStorage.getItem("sm_sign_in"),
                    },
                });
                task.run();
            }
        }
    }, [init]);

    const signUp = () => new Promise(async (resolve, reject) => {});

    const signIn = ({ type }) =>
        new Promise(async (resolve, reject) => {
            try {
                setUser({
                    status: "pending",
                    payload: {
                        provider: type,
                    },
                });
                window.sessionStorage.setItem("sm_sign_in", type);
                task.run();
                switch (type) {
                    case "google":
                        signInWithGoogle();
                        break;
                    default:
                        break;
                }
                return resolve();
            } catch (e) {
                return reject(e);
            }
        });

    const signInWithGoogle = () => _signInWithRedirect();

    const signOut = () =>
        new Promise(async (resolve, reject) => {
            try {
                await _signOut();
                return resolve();
            } catch (e) {
                console.dir(e);
                return reject(e);
            }
        });

    const value = {
        init,
        user,
        signUp,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuthContext = () => React.useContext(AuthContext);

export const RequireAuth = ({ children }) => {
    const { user } = useAuthContext();
    const location = useLocation();

    if (user?.status !== "fulfilled") {
        return <Navigate to="/" state={{ from: location }} replace />;
    } else {
        return children;
    }
};

import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { _signInWithRedirect, _signOut } from "utils/firebase/auth";
import { auth } from "utils/firebase";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
    const [init, setInit] = React.useState(false);
    const [user, setUser] = React.useState({
        status: "idle",
        payload: {},
    });

    React.useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            setInit(true);
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

    console.log("d user", user);
    if (user?.status !== "fulfilled") {
        return <Navigate to="/" state={{ from: location }} replace />;
    } else {
        return children;
    }
};

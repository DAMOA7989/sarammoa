import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { _signInWithRedirect } from "utils/firebase/auth";
import { auth } from "utils/firebase";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("d user", user);
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    const signUp = () => new Promise(async (resolve, reject) => {});

    const signIn = ({ type }) => {
        switch (type) {
            case "google":
                return signInWithGoogle();
            default:
                break;
        }
    };

    const signInWithGoogle = () =>
        new Promise(async (resolve, reject) => {
            try {
                await _signInWithRedirect();
            } catch (e) {
                return reject(e);
            }
        });

    const signOut = () => new Promise(async (resolve, reject) => {});

    const value = {
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

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    } else {
        return children;
    }
};

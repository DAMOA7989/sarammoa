import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import {
    _signInWithRedirect,
    _signOut,
    _setUserInfo,
    _getUserInfo,
} from "utils/firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "utils/firebase";
import { useStatusContext } from "utils/status";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
    const { task } = useStatusContext();
    const [init, setInit] = React.useState(false);
    const [user, setUser] = React.useState({
        status: "idle",
        payload: {},
    });
    const [userInfo, setUserInfo] = React.useState(null);

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
        if (user?.status !== "fulfilled") {
            setUser(null);
            setUserInfo(null);
            return;
        } else {
            const _user = user?.payload?.user;
            setUser(user);
            _setUserInfo({
                uid: _user?.uid,
                payload: {},
            })
                .then(() => {})
                .catch((e) => {
                    console.dir(e);
                    setUserInfo(null);
                });

            const unsubscribe = onSnapshot(
                doc(db, "users", _user?.uid),
                (docSnap) => {
                    if (docSnap.exists()) {
                        setUserInfo({
                            id: docSnap.id,
                            ...docSnap.data(),
                        });
                    } else {
                        setUserInfo(null);
                    }
                }
            );

            return () => {
                unsubscribe();
            };
        }
    }, [user]);

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
        userInfo: userInfo
            ? {
                  ...userInfo,
                  refresh: () => {
                      _getUserInfo({ uid: userInfo?.id })
                          .then((res) => {
                              setUserInfo(res);
                          })
                          .catch((e) => {
                              console.dir(e);
                          });
                  },
              }
            : null,
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

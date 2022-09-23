import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import {
    _logAccess,
    _signInWithRedirect,
    _signOut,
    _getUserInfo,
    _createUserWithEmailAndPassword,
    _signInWithEmailAndPassword,
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

            _logAccess({ uid: _user?.uid });

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
                    task.finish();
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

    const signUp = ({ type, email, password }) =>
        new Promise(async (resolve, reject) => {
            try {
                setUser({
                    status: "pending",
                    payload: {
                        provider: type,
                    },
                });
                window.sessionStorage.setItem("sm_sign_in", type);
                // task.run();
                switch (type) {
                    case "email":
                        await signUpWithEmailAndPassword({ email, password });
                        break;
                }
                return resolve();
            } catch (e) {
                setUser({
                    status: "rejected",
                    payload: null,
                });
                return reject(e);
            }
        });

    const signUpWithEmailAndPassword = ({ email, password }) => {
        return _createUserWithEmailAndPassword({ email, password });
    };

    const signIn = ({ type, payload = {} }) =>
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
                    case "kakao":
                        signInWithKakao();
                        break;
                    case "google":
                        signInWithGoogle();
                        break;
                    case "email":
                        await signInWithEmail({
                            email: payload?.email,
                            password: payload?.password,
                        });
                        break;
                    default:
                        break;
                }
                return resolve();
            } catch (e) {
                setUser({
                    status: "rejected",
                    payload: null,
                });
                task.finish();
                return reject(e);
            }
        });

    const signInWithKakao = () => {
        const kakao = window.Kakao;

        if (!kakao) {
            return;
        }

        if (!kakao.isInitialized()) {
            return;
        }

        kakao.Auth.authorize({
            redirectUri: `${process.env.REACT_APP_HOST_URL}/oauth/kakao/signin`,
        });
    };

    const signInWithGoogle = () => _signInWithRedirect();

    const signInWithEmail = ({ email, password }) =>
        _signInWithEmailAndPassword({
            email,
            password,
        });

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

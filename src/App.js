import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
    EmailSignin,
    EmailSignup,
    EmailFind,
    KakaoSignin,
    Protected,
    Connect,
    ConnectCreate,
    ConnectPeople,
    ConnectTeams,
    Notice,
    NoticeMessage,
    NoticeMessageRedirect,
    NoticeMessageDetail,
    NoticeNotification,
    Profile,
    ProfileWork,
    ProfileWorkAdd,
    ProfileInformation,
    ProfileHistory,
    ProfileSetup,
    ProfileEdit,
    Support,
    WritingDetail,
    Newsfeed,
    User,
    UserDetail,
    UserDetailWork,
    UserDetailHistory,
    UserDetailInformation,
    SplashScreen,
} from "pages";
import MainLayout from "components/layout/MainLayout";
import SubLayout from "components/layout/SubLayout";
import { gapi } from "gapi-script";
import { RequireAuth } from "utils/auth";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useNavigateContext } from "utils/navigate";
import { useAuthContext } from "utils/auth";
import Modal from "components/layout/Modal";
import Pending from "components/layout/Pending";
import { useStatusContext } from "utils/status";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStoreContext } from "utils/store";

const App = () => {
    const { init, user, userInfo } = useAuthContext();
    const location = useLocation();
    const { messages } = useStoreContext();

    React.useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: "",
            });
            gapi.load("client:auth2", initClient);
        };
    }, []);

    React.useEffect(() => {
        if (!userInfo?.id) return;

        const unobserve = messages.observe({ uid: userInfo?.id });
        return () => unobserve();
    }, [userInfo?.id]);

    React.useEffect(() => {
        // setIsLoading(true);
        const script = window.document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.async = true;
        window.document.body.appendChild(script);

        script.onload = () => {
            // setIsLoading(false);
            const kakao = window.Kakao;
            if (!kakao) return;

            if (!kakao.isInitialized()) {
                kakao.init(process.env.REACT_APP_KAKAO_APP_JAVASCRIPT_KEY);
            }
        };
        return () => window.document.body.removeChild(script);
    }, []);

    if (!init && !Boolean(window.sessionStorage.getItem("sm_sign_in"))) {
        return <SplashScreen />;
    }

    return (
        <>
            <Routes location={location}>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Newsfeed />} />
                    <Route path="user" element={<User />}>
                        <Route path=":uid" element={<UserDetail />}>
                            <Route path="" element={<UserDetailWork />} />
                            <Route
                                path="history"
                                element={<UserDetailHistory />}
                            />
                            <Route
                                path="information"
                                element={<UserDetailInformation />}
                            />
                        </Route>
                    </Route>
                    <Route
                        element={
                            <RequireAuth>
                                <Protected />
                            </RequireAuth>
                        }
                    >
                        <Route path="support" element={<Support />} />
                        <Route path="connect" element={<Connect />}></Route>
                        <Route path="notice" element={<Notice />}>
                            <Route path="" element={<NoticeMessage />} />
                            <Route
                                path="notification"
                                element={<NoticeNotification />}
                            />
                        </Route>
                        <Route path="profile" element={<Profile />}>
                            <Route path="" element={<ProfileWork />} />
                            <Route
                                path="information"
                                element={<ProfileInformation />}
                            />
                            <Route
                                path="history"
                                element={<ProfileHistory />}
                            />
                        </Route>
                    </Route>
                </Route>
                <Route path="/sub" element={<SubLayout />}>
                    <Route path="user">
                        <Route path=":uid" element={<UserDetail />}>
                            <Route path="" element={<UserDetailWork />} />
                            <Route
                                path="history"
                                element={<UserDetailHistory />}
                            />
                            <Route
                                path="information"
                                element={<UserDetailInformation />}
                            />
                        </Route>
                    </Route>
                    <Route
                        element={
                            <RequireAuth>
                                <Protected />
                            </RequireAuth>
                        }
                    >
                        <Route path="profile">
                            <Route path="setup" element={<ProfileSetup />} />
                            <Route path="edit" element={<ProfileEdit />} />
                            <Route path="work">
                                <Route
                                    path="add"
                                    element={<ProfileWorkAdd />}
                                />
                            </Route>
                        </Route>
                        <Route path="connect">
                            <Route path="create" element={<ConnectCreate />} />
                            <Route path="people" element={<ConnectPeople />} />
                            <Route path="teams" element={<ConnectTeams />} />
                        </Route>
                        <Route path="notice">
                            <Route
                                path="redirect"
                                element={<NoticeMessageRedirect />}
                            />
                            <Route
                                path=":rid"
                                element={<NoticeMessageDetail />}
                            />
                        </Route>
                        <Route path="writing">
                            <Route path=":wid" element={<WritingDetail />} />
                        </Route>
                    </Route>
                </Route>
                <Route path="/oauth">
                    <Route path="kakao">
                        <Route path="signin" element={<KakaoSignin />} />
                    </Route>
                </Route>
                <Route path="/auth" element={<SubLayout />}>
                    <Route path="email">
                        <Route path="signin" element={<EmailSignin />} />
                        <Route path="signup" element={<EmailSignup />} />
                        <Route path="find" element={<EmailFind />} />
                    </Route>
                </Route>
                <Route path="/publish">
                    <Route path="writing">
                        <Route path=":wid" element={<WritingDetail />} />
                    </Route>
                    <Route path="user">
                        <Route path=":uid" element={<UserDetail />}>
                            <Route path="" element={<UserDetailWork />} />
                            <Route
                                path="history"
                                element={<UserDetailHistory />}
                            />
                            <Route
                                path="information"
                                element={<UserDetailInformation />}
                            />
                        </Route>
                    </Route>
                </Route>
            </Routes>
            <Modal />
            <Pending />
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={true}
            />
        </>
    );
};

export default App;

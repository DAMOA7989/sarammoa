import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
    Protected,
    Connect,
    Notice,
    Profile,
    ProfileHistory,
    ProfileInformation,
    ProfileScrap,
    ProfileSetup,
    ProfileEdit,
    Support,
    Newsfeed,
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

const App = () => {
    const { init, user } = useAuthContext();
    const { mode } = useNavigateContext();
    const { task } = useStatusContext();
    const location = useLocation();

    React.useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: "",
            });
            gapi.load("client:auth2", initClient);
        };
    }, []);

    if (!init && !Boolean(window.sessionStorage.getItem("sm_sign_in"))) {
        return <SplashScreen />;
    }

    return (
        <>
            <Routes location={location}>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Newsfeed />} />
                    <Route
                        element={
                            <RequireAuth>
                                <Protected />
                            </RequireAuth>
                        }
                    >
                        <Route path="support" element={<Support />} />
                        <Route path="connect" element={<Connect />} />
                        <Route path="notice" element={<Notice />} />
                        <Route path="profile" element={<Profile />}>
                            <Route path="" element={<ProfileHistory />} />
                            <Route
                                path="information"
                                element={<ProfileInformation />}
                            />
                            <Route path="scrap" element={<ProfileScrap />} />
                        </Route>
                    </Route>
                </Route>
                <Route path="/sub" element={<SubLayout />}>
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
                        </Route>
                    </Route>
                </Route>
            </Routes>
            <Modal />
            <Pending />
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={true}
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

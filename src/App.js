import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
    Protected,
    Connect,
    Notice,
    Profile,
    ProfileHistory,
    ProfileInformation,
    ProfileEtc,
    ProfileSetup,
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
                            <Route path="etc" element={<ProfileEtc />} />
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
                        <Route
                            path="profile/setup"
                            element={<ProfileSetup />}
                        />
                    </Route>
                </Route>
            </Routes>
            <Modal />
            <Pending />
        </>
    );
};

export default App;

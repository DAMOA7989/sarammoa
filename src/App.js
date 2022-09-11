import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
    Connect,
    Notice,
    Profile,
    ProfileHistory,
    ProfileInformation,
    ProfileEtc,
    ProfileSetup,
    Support,
    NewsFeed,
} from "pages";
import MainLayout from "components/layout/MainLayout";
import SubLayout from "components/layout/SubLayout";
import { AuthProvider } from "utils/auth";
import { gapi } from "gapi-script";
import { RequireAuth } from "utils/auth";
import { NavigateProvider } from "utils/navigate";

const App = () => {
    React.useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: "",
            });
            gapi.load("client:auth2", initClient);
        };
    }, []);

    return (
        <AuthProvider>
            <NavigateProvider>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<NewsFeed />} />
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
                    <Route path="/sub" element={<SubLayout />}>
                        <Route
                            path="profile/setup"
                            element={<ProfileSetup />}
                        />
                    </Route>
                </Routes>
            </NavigateProvider>
        </AuthProvider>
    );
};

export default App;

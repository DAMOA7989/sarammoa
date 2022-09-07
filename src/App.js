import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Connect, Notice, Profile, Support, NewsFeed } from "pages";
import AppLayout from "components/layout/AppLayout";
import { AuthProvider } from "utils/auth";
import { gapi } from "gapi-script";

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
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<NewsFeed />} />
                    <Route path="support" element={<Support />} />
                    <Route path="connect" element={<Connect />} />
                    <Route path="notice" element={<Notice />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default App;

import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Connect, Notice, Profile, Support, NewsFeed } from "pages";
import AppLayout from "components/layout/AppLayout";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<NewsFeed />} />
                    <Route path="support" element={<Support />} />
                    <Route path="connect" element={<Connect />} />
                    <Route path="notice" element={<Notice />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </div>
    );
};

export default App;

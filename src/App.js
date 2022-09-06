import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Connect, Notice, Profile, Support, NewsFeed } from "pages";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<NewsFeed />} />
                <Route path="support" element={<Support />} />
                <Route path="connect" element={<Connect />} />
                <Route path="notice" element={<Notice />} />
                <Route path="profile" element={<Profile />} />
            </Routes>
        </div>
    );
};

export default App;

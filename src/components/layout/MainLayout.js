import React from "react";
import BottomNavigation from "components/navigation/BottomNavigation";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <Outlet />
            <BottomNavigation />
        </>
    );
};

export default MainLayout;

import React from "react";
import BottomNavigation from "components/navigation/BottomNavigation";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <>
            <Outlet />
            <BottomNavigation />
        </>
    );
};

export default AppLayout;

import React from "react";
import BottomNavigator from "components/navigator/BottomNavigator";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <>
            <Outlet />
            <BottomNavigator />
        </>
    );
};

export default AppLayout;

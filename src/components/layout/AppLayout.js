import React from "react";
import AppFooter from "components/footer/AppFooter";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <>
            <Outlet />
            <AppFooter />
        </>
    );
};

export default AppLayout;

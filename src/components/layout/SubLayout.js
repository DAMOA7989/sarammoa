import React from "react";
import { Outlet } from "react-router-dom";
import SubHeader from "components/header/SubHeader";

const SubLayout = () => {
    return (
        <>
            <SubHeader />
            <Outlet />
        </>
    );
};

export default SubLayout;

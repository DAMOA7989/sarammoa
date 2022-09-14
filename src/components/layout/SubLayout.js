import React from "react";
import { Outlet } from "react-router-dom";
import SubHeader from "components/header/SubHeader";
import { CSSTransition } from "react-transition-group";
import { useNavigateContext } from "utils/navigate";

const SubLayout = () => {
    const { isRouting } = useNavigateContext();

    return (
        <div className="sub-layout">
            <SubHeader />
            <Outlet />
        </div>
    );
};

export default SubLayout;

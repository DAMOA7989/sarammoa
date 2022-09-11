import React from "react";
import { Outlet } from "react-router-dom";
import SubHeader from "components/header/SubHeader";
import { CSSTransition } from "react-transition-group";
import { useNavigateContext } from "utils/navigate";

const SubLayout = () => {
    const { isRouting } = useNavigateContext();

    return (
        <CSSTransition timeout={300} in={isRouting} classNames={"sub"}>
            <>
                <SubHeader />
                <Outlet />
            </>
        </CSSTransition>
    );
};

export default SubLayout;

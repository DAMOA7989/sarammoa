import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigateContext } from "utils/navigate";

const ConnectCreate = () => {
    const navigate = useNavigateContext();
    const [screenIdx, setScreenIdx] = React.useState(0);

    React.useLayoutEffect(() => {
        switch (screenIdx) {
            case 0:
                navigate.replace({
                    pathname: "/connect/create",
                    mode: "sub",
                });
                break;
            case 1:
                navigate.replace({
                    pathname: "/connect/create/invite",
                    mode: "sub",
                });
                break;
            case 2:
                navigate.replace({
                    pathname: "/connect/create/submit",
                    mode: "sub",
                });
                break;
        }
    }, [screenIdx]);

    return <Outlet context={{ screenIdx, setScreenIdx }} />;
};

export default ConnectCreate;

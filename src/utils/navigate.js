import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NavigateContext = React.createContext(null);

export const NavigateProvider = ({ children }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pathname, setPathname] = React.useState("");
    const [mode, setMode] = React.useState(null);
    const [screenTitle, setScreenTitle] = React.useState("");
    const [isRouting, setIsRouting] = React.useState(false);

    console.log("d mode", mode);
    const push = ({ pathname: _pathname, mode, screenTitle, replace }) => {
        setPathname(_pathname);
        setScreenTitle(screenTitle || "");
        setMode(mode || "main");
        setIsRouting(true);
    };

    React.useEffect(() => {
        if (!isRouting) return;
        if (mode === "sub") {
            navigate(
                `${
                    mode === "main" ? "" : mode === "sub" ? "/sub" : ""
                }${pathname}`
            );
            setIsRouting(false);
        } else {
            navigate(
                `${
                    mode === "main" ? "" : mode === "sub" ? "/sub" : ""
                }${pathname}`
            );
            setIsRouting(false);
        }
    }, [isRouting, mode]);

    const goBack = () => {};

    const value = {
        mode,
        screenTitle,
        isRouting,
        push,
        goBack,
    };

    return (
        <NavigateContext.Provider value={value}>
            {children}
        </NavigateContext.Provider>
    );
};

export const useNavigateContext = () => React.useContext(NavigateContext);

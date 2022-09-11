import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NavigateContext = React.createContext(null);

export const NavigateProvider = ({ children }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pathname, setPathname] = React.useState("");
    const [stack, setStack] = React.useState("main");
    const [screenTitle, setScreenTitle] = React.useState("");
    const [isRouting, setIsRouting] = React.useState(false);

    const push = ({ pathname: _pathname, stack, screenTitle, replace }) => {
        setPathname(_pathname);
        setScreenTitle(screenTitle || "");
        setStack(stack || "main");
        setIsRouting(true);
    };

    React.useEffect(() => {
        if (!isRouting) return;
        navigate(
            `${
                stack === "main" ? "" : stack === "sub" ? "/sub" : ""
            }${pathname}`
        );
        setIsRouting(false);
    }, [isRouting]);

    const goBack = () => {};

    const value = {
        stack,
        screenTitle,
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

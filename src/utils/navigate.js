import React from "react";
import { useNavigate } from "react-router-dom";

const NavigateContext = React.createContext(null);

export const NavigateProvider = ({ children }) => {
    const navigate = useNavigate();
    const [pathname, setPathname] = React.useState("");
    const [mode, setMode] = React.useState(null);
    const [screenTitle, setScreenTitle] = React.useState("");
    const [isReplace, setIsReplace] = React.useState(false);
    const [isRouting, setIsRouting] = React.useState(false);

    const push = ({ pathname: _pathname, mode, screenTitle }) => {
        setPathname(_pathname);
        setScreenTitle(screenTitle || "");
        setMode(mode || "main");
        setIsRouting(true);
    };

    const replace = ({ pathname: _pathname, mode, screenTitle }) => {
        setPathname(_pathname);
        setScreenTitle(screenTitle || "");
        setMode(mode || "main");
        setIsReplace(true);
        setIsRouting(true);
    };

    React.useEffect(() => {
        if (!isRouting) return;
        if (typeof pathname === "number") {
            navigate(pathname);
        } else if (mode === "sub") {
            if (isReplace) {
                navigate(
                    `${
                        mode === "main" ? "" : mode === "sub" ? "/sub" : ""
                    }${pathname}`,
                    { replace: true }
                );
                setIsReplace(false);
            } else {
                navigate(
                    `${
                        mode === "main" ? "" : mode === "sub" ? "/sub" : ""
                    }${pathname}`
                );
            }
        } else {
            if (isReplace) {
                navigate(
                    `${
                        mode === "main" ? "" : mode === "sub" ? "/sub" : ""
                    }${pathname}`,
                    { replace: true }
                );
                setIsReplace(false);
            } else {
                navigate(
                    `${
                        mode === "main" ? "" : mode === "sub" ? "/sub" : ""
                    }${pathname}`
                );
            }
        }
        setMode(null);
        // setScreenTitle("");
        setIsRouting(false);
    }, [isRouting]);

    const goBack = () => {
        setPathname(-1);
        setIsRouting(true);
    };

    const value = {
        mode,
        screenTitle,
        isRouting,
        push,
        replace,
        goBack,
    };

    return (
        <NavigateContext.Provider value={value}>
            {children}
        </NavigateContext.Provider>
    );
};

export const useNavigateContext = () => React.useContext(NavigateContext);

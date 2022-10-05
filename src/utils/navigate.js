import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBackListener } from "utils/hook";

const NavigateContext = React.createContext(null);

export const NavigateProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useBackListener(({ location }) => {
        const navigateStack = JSON.parse(
            window.sessionStorage.getItem("sm_navigate_stack")
        );
        const newNavigateStack = [
            ...navigateStack.splice(0, navigateStack.length - 1),
        ];

        window.sessionStorage.setItem(
            "sm_navigate_stack",
            JSON.stringify(newNavigateStack)
        );
        dispatch({
            type: "GO_BACK",
            payload: {
                pathname:
                    newNavigateStack?.[newNavigateStack.length - 1]?.pathname ||
                    "/",
                mode:
                    newNavigateStack?.[newNavigateStack.length - 1]?.mode ||
                    "main",
                screenTitle:
                    newNavigateStack?.[newNavigateStack.length - 1]
                        ?.screenTitle || "",
            },
        });
    });

    const reducer = (state, action) => {
        switch (action.type) {
            case "PUSH":
                return {
                    ...state,
                    pathname: action.payload?.pathname,
                    mode: action.payload?.mode,
                    screenTitle: action.payload?.screenTitle,
                    routing: true,
                };
            case "REPLACE":
                return {
                    ...state,
                    pathname: action.payload?.pathname,
                    mode: action.payload?.mode,
                    screenTitle: action.payload?.screenTitle,
                    replace: true,
                    routing: true,
                };
            case "REPLACE_FINISH":
                return {
                    ...state,
                    replace: false,
                };
            case "GO_BACK":
                return {
                    ...state,
                    pathname: action.payload?.pathname,
                    mode: action.payload?.mode,
                    screenTitle: action.payload?.screenTitle,
                    routing: true,
                };
            case "ROUTING_START":
                return {
                    ...state,
                    routing: true,
                };
            case "ROUTING_FINISH":
                return {
                    ...state,
                    routing: false,
                };
            case "SET_LAYOUT":
                return {
                    ...state,
                    right: action.payload?.right,
                };
            case "CLEAR_LAYOUT":
                return {
                    ...state,
                    right: null,
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = React.useReducer(reducer, {
        pathname:
            JSON.parse(window.sessionStorage.getItem("sm_navigate_stack"))
                ?.pathname || "/",
        mode:
            JSON.parse(window.sessionStorage.getItem("sm_navigate_stack"))
                ?.mode || "main",
        screenTitle:
            JSON.parse(window.sessionStorage.getItem("sm_navigate_stack"))
                ?.screenTitle || "",
        right: null,
        replace: false,
        routing: false,
    });

    React.useEffect(() => {
        const navigateStack =
            window.sessionStorage.getItem("sm_navigate_stack");
        if (
            !navigateStack ||
            (Array.isArray(navigateStack) && navigateStack.length === 0)
        ) {
            window.location.reload();
            window.sessionStorage.setItem(
                "sm_navigate_stack",
                JSON.stringify([
                    {
                        pathname: location.pathname,
                    },
                ])
            );
        }
    }, []);

    const push = ({
        pathname: _pathname,
        mode: _mode,
        screenTitle: _screenTitle,
    }) => {
        const navigateStack = JSON.parse(
            window.sessionStorage.getItem("sm_navigate_stack")
        );
        window.sessionStorage.setItem(
            "sm_navigate_stack",
            JSON.stringify([
                ...navigateStack,
                {
                    pathname: _pathname,
                    mode: _mode,
                    screenTitle: _screenTitle,
                },
            ])
        );

        dispatch({
            type: "PUSH",
            payload: {
                pathname: _pathname,
                mode: _mode,
                screenTitle: _screenTitle,
            },
        });
    };

    const replace = ({
        pathname: _pathname,
        mode: _mode,
        screenTitle: _screenTitle,
    }) => {
        const navigateStack = JSON.parse(
            window.sessionStorage.getItem("sm_navigate_stack")
        );
        window.sessionStorage.setItem(
            "sm_navigate_stack",
            JSON.stringify([
                ...navigateStack.slice(0, navigateStack.length - 1),
                {
                    pathname: _pathname,
                    mode: _mode,
                    screenTitle: _screenTitle,
                },
            ])
        );
        dispatch({
            type: "REPLACE",
            payload: {
                pathname: _pathname || "",
                mode: _mode || "main",
                screenTitle: _screenTitle || "",
            },
        });
    };

    const goBack = () => {
        const navigateStack = JSON.parse(
            window.sessionStorage.getItem("sm_navigate_stack")
        );
        const newNavigateStack = [
            ...navigateStack.slice(0, navigateStack.length - 1),
        ];
        window.sessionStorage.setItem(
            "sm_navigate_stack",
            JSON.stringify(newNavigateStack)
        );
        dispatch({
            type: "GO_BACK",
            payload: {
                pathname:
                    newNavigateStack?.[newNavigateStack.length - 1]?.pathname ||
                    "/",
                mode:
                    newNavigateStack?.[newNavigateStack.length - 1]?.mode ||
                    "main",
                screenTitle:
                    newNavigateStack?.[newNavigateStack.length - 1]
                        ?.screenTitle || "",
            },
        });
    };

    React.useEffect(() => {
        if (!state.routing) return;
        const { pathname, mode, screenTitle, replace } = state;
        if (typeof pathname === "number") {
            navigate(pathname);
        } else if (mode === "sub") {
            if (replace) {
                navigate(
                    `${
                        mode === "main" ? "" : mode === "sub" ? "/sub" : ""
                    }${pathname}`,
                    { replace: true }
                );
                dispatch({
                    type: "REPLACE_FINISH",
                });
            } else {
                navigate(
                    `${
                        mode === "main" ? "" : mode === "sub" ? "/sub" : ""
                    }${pathname}`
                );
            }
        } else {
            if (replace) {
                navigate(
                    `${
                        mode === "main" ? "" : mode === "sub" ? "/sub" : ""
                    }${pathname}`,
                    { replace: true }
                );
                dispatch({
                    type: "REPLACE_FINISH",
                });
            } else {
                navigate(
                    `${
                        mode === "main" ? "" : mode === "sub" ? "/sub" : ""
                    }${pathname}`
                );
            }
        }
        dispatch({
            type: "ROUTING_FINISH",
        });
    }, [state.routing]);

    const setLayout = ({ right }) => {
        const payload = {};

        if (right) payload.right = right;

        dispatch({
            type: "SET_LAYOUT",
            payload,
        });
    };

    const clearLayout = () => {
        dispatch({
            type: "CLEAR_LAYOUT",
        });
    };

    const value = {
        state,
        push,
        replace,
        goBack,
        setLayout,
        clearLayout,
    };

    return (
        <NavigateContext.Provider value={value}>
            {children}
        </NavigateContext.Provider>
    );
};

export const useNavigateContext = () => React.useContext(NavigateContext);

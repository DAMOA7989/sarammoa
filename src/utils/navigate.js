import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBackListener } from "utils/hook";

const NavigateContext = React.createContext(null);

export const NavigateProvider = ({ children }) => {
    const navigate = useNavigate();

    const reducer = (state, action) => {
        switch (action.type) {
            case "PUSH":
                return {
                    ...state,
                    pathname: action.payload?.pathname,
                    mode: action.payload?.mode,
                    screenTitle: null,
                    routing: true,
                };
            case "REPLACE":
                return {
                    ...state,
                    pathname: action.payload?.pathname,
                    mode: action.payload?.mode,
                    screenTitle: null,
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
                    screenTitle: null,
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
                const _state = {
                    ...state,
                };
                for (const key in action.payload || {}) {
                    _state[key] = action.payload[key];
                }
                return _state;
            case "CLEAR_LAYOUT":
                return {
                    ...state,
                    right: null,
                    goBack: null,
                    screenTitle: null,
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = React.useReducer(reducer, {
        pathname: null,
        mode: null,
        screenTitle: null,
        right: null,
        replace: false,
        routing: false,
    });

    const push = ({ pathname: _pathname, mode: _mode }) => {
        dispatch({
            type: "PUSH",
            payload: {
                pathname: _pathname,
                mode: _mode || "main",
            },
        });
    };

    const replace = ({ pathname: _pathname, mode: _mode }) => {
        dispatch({
            type: "REPLACE",
            payload: {
                pathname: _pathname,
                mode: _mode || "main",
            },
        });
    };

    const goBack = () => {
        dispatch({
            type: "GO_BACK",
            payload: {
                pathname: -1,
            },
        });
    };

    React.useEffect(() => {
        if (!state.routing) return;
        const { pathname, mode, replace } = state;
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

    const setLayout = ({ right, goBack, screenTitle }) => {
        const payload = {};

        if (right) payload.right = right;
        if (goBack) payload.goBack = goBack;
        if (screenTitle) payload.screenTitle = screenTitle;

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

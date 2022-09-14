import React from "react";

const ModalContext = React.createContext(null);

export const ModalProvider = ({ children }) => {
    const [path, setPath] = React.useState(null);
    const [params, setParams] = React.useState(null);
    const [options, setOptions] = React.useState(null);

    const displayModal = React.useCallback(
        ({ pathname: _pathname, params: _params, options: _options }) => {
            setPath(_pathname);
            setParams(_params);
            setOptions(_options);
        },
        [path, params, options]
    );

    const dismissModal = React.useCallback(() => {
        setPath(null);
        setParams(null);
        setOptions(null);
    }, [path, params, options]);

    const value = {
        path,
        params,
        options,
        displayModal,
        dismissModal,
    };

    return (
        <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
    );
};

export const useModalContext = () => React.useContext(ModalContext);

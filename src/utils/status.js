import React from "react";

const StatusContext = React.createContext(null);

export const StatusProvider = ({ children }) => {
    const [isPending, setIsPending] = React.useState(false);

    const task = {
        status: isPending,
        run: React.useCallback(() => {
            setIsPending(true);
        }, [isPending]),
        finish: React.useCallback(() => {
            setIsPending(false);
        }, [isPending]),
    };

    const value = {
        task,
    };

    return (
        <StatusContext.Provider value={value}>
            {children}
        </StatusContext.Provider>
    );
};

export const useStatusContext = () => React.useContext(StatusContext);

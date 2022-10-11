import React from "react";
import { useTranslation } from "react-i18next";

const StatusContext = React.createContext(null);

export const StatusProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [isPending, setIsPending] = React.useState(false);

    const task = {
        status: isPending,
        run: React.useCallback(() => {
            setIsPending(true);
        }, [isPending]),
        terminate: React.useCallback(() => {
            setIsPending(false);
        }, [isPending]),
    };

    const lang = {
        change: (lang) => {
            i18n.changeLanguage(lang);
        },
    };

    const value = {
        task,
        lang,
    };

    return (
        <StatusContext.Provider value={value}>
            {children}
        </StatusContext.Provider>
    );
};

export const useStatusContext = () => React.useContext(StatusContext);

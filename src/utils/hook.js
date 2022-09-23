import React from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";

export const useBackListener = (callback) => {
    const navigator = React.useContext(UNSAFE_NavigationContext).navigator;

    React.useEffect(() => {
        const listener = ({ location, action }) => {
            if (action === "POP") {
                callback({ location, action });
            }
        };

        const unlisten = navigator.listen(listener);
        return unlisten;
    }, [callback, navigator]);
};

export const useBlocker = (blocker, when = true) => {
    const {} = React.useContext(UNSAFE_NavigationContext);

    React.useEffect(() => {
        if (!when) return;

        const unblock = navigator.block((tx) => {
            const autoUnblockingTx = {
                ...tx,
                retry: () => {
                    unblock();
                    tx.retry();
                },
            };

            blocker(autoUnblockingTx);
        });

        return unblock;
    }, [navigator, blocker, when]);
};

export const usePrompt = (message, when = true) => {
    const blocker = React.useCallback(
        (tx) => {
            if (window.confirm(message)) tx.retry();
        },
        [message]
    );

    useBlocker(blocker, when);
};

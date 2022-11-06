import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import { useOutletContext } from "react-router-dom";

const ConnectCreateInvite = () => {
    const { t } = useTranslation();
    const { screenIdx, setScreenIdx } = useOutletContext();
    const navigate = useNavigateContext();

    React.useLayoutEffect(() => {
        navigate.setLayout({
            right: {
                next: {
                    title: t("btn.next"),
                    onClick: () => {
                        setScreenIdx(screenIdx + 1);
                    },
                },
            },
            goBack: {
                onClick: () => {
                    setScreenIdx(screenIdx - 1);
                },
            },
        });
    }, []);

    return <main className="protected-connect-create-invite">invite</main>;
};

export default ConnectCreateInvite;

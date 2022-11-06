import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import { useOutletContext } from "react-router-dom";

const ConnectCreateInfo = () => {
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
        });
    }, []);

    return <main className="protected-connect-create-info">info</main>;
};

export default ConnectCreateInfo;

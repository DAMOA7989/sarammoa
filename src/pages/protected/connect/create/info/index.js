import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";

const ConnectCreateInfo = ({ _idx, screenIdx, setScreenIdx }) => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();

    React.useLayoutEffect(() => {
        if (screenIdx === _idx) {
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
        }
    }, [screenIdx]);

    return <main className="protected-connect-create-info">info</main>;
};

export default ConnectCreateInfo;

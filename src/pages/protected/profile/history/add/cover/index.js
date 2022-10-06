import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";

const ProfileHistoryAddCover = ({
    _idx,
    screenIdx,
    setScreenIdx,
    contents,
    setContents,
}) => {
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

    return (
        <main className="pages-protected-profile-history-add-cover">
            add cover
        </main>
    );
};

export default ProfileHistoryAddCover;

import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useTranslation, Trans } from "react-i18next";

const __OAUTH_BUTTONS__ = [
    {
        key: "google",
        imgPath: "/images/oauth/google.scg",
    },
    {
        key: "apple",
        imgPath: "/images/oauth/apple.svg",
    },
    {
        key: "facebook",
        imgPath: "/images/oauth/facebook.svg",
    },
];

const BottomNavigator = () => {
    const { t } = useTranslation();
    const [openBottomSheet, setOpenBottomSheet] = React.useState(false);
    const [canOpenBottomSheet, setCanOpenBottomSheet] = React.useState(false);

    React.useEffect(() => {
        if (openBottomSheet) return setCanOpenBottomSheet(false);
        else return setCanOpenBottomSheet(true);
    }, [openBottomSheet]);

    return (
        <nav className="components-navigator-bottom-navigator">
            <button
                className={`common-button primary ${
                    canOpenBottomSheet && "active"
                }`}
                onClick={() => setOpenBottomSheet(!openBottomSheet)}
            >
                {t("btn.start")}
            </button>
            <BottomSheet
                className="bottom-sheet bottom-navigator"
                open={openBottomSheet}
                onDismiss={() => setOpenBottomSheet(false)}
                snapPoints={({ maxHeight }) => 0.5 * maxHeight}
            >
                <div className="bottom-sheet-body">
                    <Trans
                        className="desc"
                        parent="p"
                        i18nKey={"text.bottom_sheet.desc"}
                    />
                    <section className="bottom">
                        <ul className="oauth-buttons">
                            {__OAUTH_BUTTONS__.map((x) => (
                                <li key={x.key}>
                                    <div
                                        className={`${x.key}`}
                                        data-img-path={x.imgPath}
                                    />
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`text-button primary active`}
                            onClick={() => setOpenBottomSheet(false)}
                        >
                            {t("btn.after")}
                        </button>
                    </section>
                </div>
            </BottomSheet>
        </nav>
    );
};

export default BottomNavigator;

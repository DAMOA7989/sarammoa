import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useTranslation, Trans } from "react-i18next";
import { useAuthContext } from "utils/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as NewsFeedIcon } from "assets/images/tabs/newsfeed.svg";
import { ReactComponent as SupportIcon } from "assets/images/tabs/support.svg";
import { ReactComponent as ConnectIcon } from "assets/images/tabs/connect.svg";
import { ReactComponent as NoticeIcon } from "assets/images/tabs/notice.svg";
import { ReactComponent as ProfileIcon } from "assets/images/tabs/profile.svg";
import { ReactComponent as NewsFeedActiveIcon } from "assets/images/tabs/newsfeed_active.svg";
import { ReactComponent as SupportActiveIcon } from "assets/images/tabs/support_active.svg";
import { ReactComponent as ConnectActiveIcon } from "assets/images/tabs/connect_active.svg";
import { ReactComponent as NoticeActiveIcon } from "assets/images/tabs/notice_active.svg";
import { ReactComponent as ProfileActiveIcon } from "assets/images/tabs/profile_active.svg";

const __OAUTH_BUTTONS__ = [
    {
        key: "google",
        imgPath: "/images/oauth/google.png",
        onClick: ({ signIn }) => {
            signIn({ type: "google" })
                .then(() => {})
                .catch((e) => console.dir(e));
        },
    },
    {
        key: "apple",
        imgPath: "/images/oauth/apple.png",
        onClick: ({ signIn }) => {},
    },
    {
        key: "facebook",
        imgPath: "/images/oauth/facebook.png",
        onClick: ({ signIn }) => {},
    },
];

const __TABS__ = [
    {
        key: "newsfeed",
        path: "/",
        i18nKey: "tab.home",
        icon: {
            inactive: <NewsFeedIcon />,
            active: <NewsFeedActiveIcon />,
        },
        color: "#FF4500",
        onClick: ({ navigate }) => {
            navigate("/");
        },
    },
    {
        key: "support",
        path: "/support",
        i18nKey: "tab.support",
        icon: {
            inactive: <SupportIcon />,
            active: <SupportActiveIcon />,
        },
        color: "#FFA500",
        onClick: ({ navigate }) => {
            navigate("/support");
        },
    },
    {
        key: "connect",
        path: "/connect",
        i18nKey: "tab.connect",
        icon: {
            inactive: <ConnectIcon />,
            active: <ConnectActiveIcon />,
        },
        color: "#228B22",
        onClick: ({ navigate }) => {
            navigate("/connect");
        },
    },
    {
        key: "notice",
        path: "/notice",
        i18nKey: "tab.notice",
        icon: {
            inactive: <NoticeIcon />,
            active: <NoticeActiveIcon />,
        },
        color: "#1E90FF",
        onClick: ({ navigate }) => {
            navigate("/notice");
        },
    },
    {
        key: "profile",
        path: "/profile",
        i18nKey: "tab.profile",
        icon: {
            inactive: <ProfileIcon />,
            active: <ProfileActiveIcon />,
        },
        color: "#FF00FF",
        onClick: ({ navigate }) => {
            navigate("/profile");
        },
    },
];

const MARGIN = 16;

const BottomNavigation = () => {
    const { t } = useTranslation();
    const { user, signIn } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [openBottomSheet, setOpenBottomSheet] = React.useState(false);
    const [canOpenBottomSheet, setCanOpenBottomSheet] = React.useState(false);
    const [curTab, setCurTab] = React.useState(null);
    const [tabBarWidth, setTabBarWidth] = React.useState(
        window.innerWidth - 2 * MARGIN
    );
    const [tabWidth, setTabWidth] = React.useState(0);
    const bottomNavigationTabsRef = React.useRef(null);

    React.useEffect(() => {
        const eventHandler = (event) => {
            setTabBarWidth(window.innerWidth - 2 * MARGIN);
        };

        window.addEventListener("resize", eventHandler);
        return () => window.removeEventListener("resize", eventHandler);
    }, []);

    React.useEffect(() => {
        setTabWidth(tabBarWidth / __TABS__.length);
    }, [tabBarWidth]);

    React.useEffect(() => {
        if (openBottomSheet) return setCanOpenBottomSheet(false);
        else return setCanOpenBottomSheet(true);
    }, [openBottomSheet]);

    React.useEffect(() => {
        switch (location?.pathname?.split?.("/")?.[1]) {
            case "support":
                setCurTab(location?.pathname?.split?.("/")?.[1]);
                break;
            case "connect":
                setCurTab(location?.pathname?.split?.("/")?.[1]);
                break;
            case "notice":
                setCurTab(location?.pathname?.split?.("/")?.[1]);
                break;
            case "profile":
                setCurTab(location?.pathname?.split?.("/")?.[1]);
                break;
            default:
                setCurTab("newsfeed");
                break;
        }
    }, [location?.pathname]);

    return (
        <nav className="components-navigation-bottom-navigation">
            {user ? (
                <div className="bottom-navigation-container">
                    <ul
                        ref={bottomNavigationTabsRef}
                        className={`bottom-navigation-tabs`}
                        style={{
                            width: `${tabBarWidth}px`,
                        }}
                    >
                        {__TABS__.map((tab) => (
                            <li
                                key={tab.key}
                                className={`bottom-navigation-tabs-tab ${
                                    curTab === tab.key && "active"
                                }`}
                            >
                                <div
                                    className="container"
                                    onClick={() => tab.onClick({ navigate })}
                                >
                                    {tab.icon.inactive}
                                    <span>{t(tab.i18nKey)}</span>
                                </div>
                            </li>
                        ))}
                        <div
                            className="indicator"
                            style={{
                                backgroundColor:
                                    __TABS__[
                                        __TABS__.findIndex(
                                            (tab) => tab.key === curTab
                                        )
                                    ].color,
                            }}
                        ></div>
                    </ul>
                </div>
            ) : (
                <>
                    <button
                        className={`common-button primary ${
                            canOpenBottomSheet && "active"
                        }`}
                        onClick={() => setOpenBottomSheet(!openBottomSheet)}
                    >
                        {t("btn.start")}
                    </button>
                    <BottomSheet
                        className="bottom-sheet bottom-navigation"
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
                                                onClick={() =>
                                                    x.onClick({ signIn })
                                                }
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
                </>
            )}
        </nav>
    );
};

export default BottomNavigation;

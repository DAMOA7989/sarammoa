import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useTranslation, Trans } from "react-i18next";
import { useAuthContext } from "utils/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as KakaoIcon } from "assets/images/oauth/kakao.svg";
import { ReactComponent as GoogleIcon } from "assets/images/oauth/google.svg";
import { ReactComponent as AppleIcon } from "assets/images/oauth/apple.svg";
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
import styles from "styles/include.scss";
import { useNavigateContext } from "utils/navigate";
import CommonButton from "components/button/CommonButton";
import TextButton from "components/button/TextButton";

const __OAUTH_BUTTONS__ = [
    {
        key: "kakao",
        i18nKey: "btn.oauth.kakao",
        icon: <KakaoIcon />,
        onClick: ({ signIn }) => {},
    },
    {
        key: "google",
        i18nKey: "btn.oauth.google",
        icon: <GoogleIcon />,
        onClick: ({ signIn }) => {
            signIn({ type: "google" })
                .then(() => {})
                .catch((e) => console.dir(e));
        },
    },
    {
        key: "apple",
        i18nKey: "btn.oauth.apple",
        icon: <AppleIcon />,
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
        color: styles?.primaryColor,
        onClick: ({ push }) => {
            push({
                pathname: "/",
                mode: "main",
            });
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
        color: styles?.primaryColor,
        onClick: ({ push }) => {
            push({
                pathname: "/support",
                mode: "main",
            });
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
        color: styles?.primaryColor,
        onClick: ({ push }) => {
            push({
                pathname: "/connect",
                mode: "main",
            });
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
        color: styles?.primaryColor,
        onClick: ({ push }) => {
            push({
                pathname: "/notice",
                mode: "main",
            });
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
        color: styles?.primaryColor,
        onClick: ({ push }) => {
            push({
                pathname: "/profile",
                mode: "main",
            });
        },
    },
];

const MARGIN = 16;
const PADDING = 20;

const BottomNavigation = () => {
    const { t } = useTranslation();
    const { init, user, signIn } = useAuthContext();
    const { push } = useNavigateContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [openBottomSheet, setOpenBottomSheet] = React.useState(false);
    const [canOpenBottomSheet, setCanOpenBottomSheet] = React.useState(false);
    const [curTab, setCurTab] = React.useState(null);
    const [tabBarWidth, setTabBarWidth] = React.useState(
        window.innerWidth - 2 * PADDING
    );
    const [tabWidth, setTabWidth] = React.useState(0);
    const bottomNavigationTabsRef = React.useRef(null);

    React.useEffect(() => {
        const eventHandler = (event) => {
            setTabBarWidth(window.innerWidth - 2 * PADDING);
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
            {user?.status === "fulfilled" ? (
                <div className="bottom-navigation-container">
                    <ul
                        ref={bottomNavigationTabsRef}
                        className={`bottom-navigation-tabs`}
                        style={{
                            width: `${tabBarWidth * 0.0625}em`,
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
                                    onClick={() => tab.onClick({ push })}
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
                                    ]?.color || styles?.primaryColor,
                            }}
                        ></div>
                    </ul>
                </div>
            ) : (
                <>
                    <CommonButton
                        color="primary"
                        disabled={!canOpenBottomSheet}
                        onClick={() => setOpenBottomSheet(!openBottomSheet)}
                    >
                        {t("btn.start")}
                    </CommonButton>
                    <BottomSheet
                        className="bottom-sheet bottom-navigation"
                        open={openBottomSheet}
                        onDismiss={() => setOpenBottomSheet(false)}
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
                                                onClick={() => {
                                                    setOpenBottomSheet(false);
                                                    x.onClick({ signIn });
                                                }}
                                            >
                                                {x.icon}
                                                <span>{t(x.i18nKey)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <TextButton
                                    color="primary"
                                    onClick={() => setOpenBottomSheet(false)}
                                >
                                    {t("btn.after")}
                                </TextButton>
                            </section>
                        </div>
                    </BottomSheet>
                </>
            )}
        </nav>
    );
};

export default BottomNavigation;

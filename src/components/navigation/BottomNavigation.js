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
        icon: {
            inactive: <NewsFeedIcon />,
            active: <NewsFeedActiveIcon />,
        },
        onClick: ({ navigate }) => {
            navigate("/");
        },
    },
    {
        key: "support",
        path: "/support",
        icon: {
            inactive: <SupportIcon />,
            active: <SupportActiveIcon />,
        },
        onClick: ({ navigate }) => {
            navigate("/support");
        },
    },
    {
        key: "connect",
        path: "/connect",
        icon: {
            inactive: <ConnectIcon />,
            active: <ConnectActiveIcon />,
        },
        onClick: ({ navigate }) => {
            navigate("/connect");
        },
    },
    {
        key: "notice",
        path: "/notice",
        icon: {
            inactive: <NoticeIcon />,
            active: <NoticeActiveIcon />,
        },
        onClick: ({ navigate }) => {
            navigate("/notice");
        },
    },
    {
        key: "profile",
        path: "/profile",
        icon: {
            inactive: <ProfileIcon />,
            active: <ProfileActiveIcon />,
        },
        onClick: ({ navigate }) => {
            navigate("/profile");
        },
    },
];

const BottomNavigation = () => {
    const { t } = useTranslation();
    const { user, signIn } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [openBottomSheet, setOpenBottomSheet] = React.useState(false);
    const [canOpenBottomSheet, setCanOpenBottomSheet] = React.useState(false);
    const [curTab, setCurTab] = React.useState(null);

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
                <ul className={`bottom-navigation-tabs`}>
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
                                {curTab === tab.key
                                    ? tab.icon.active
                                    : tab.icon.inactive}
                            </div>
                        </li>
                    ))}
                    <div className="indicator"></div>
                </ul>
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

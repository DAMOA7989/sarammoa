import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import styles from "styles/include.scss";
import { useNavigateContext } from "utils/navigate";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useAuthContext } from "utils/auth";
import CommonButton from "components/button/CommonButton";
import { useModalContext } from "utils/modal";
import { ReactComponent as EditIcon } from "assets/images/icons/profile/edit.svg";
import { ReactComponent as ShareIcon } from "assets/images/icons/profile/share.svg";
import { Skeleton } from "@mui/material";
import RippleEffect from "components/surface/RippleEffect";
import LazyImage from "components/surface/LazyImage";
import LazyTypography from "components/surface/LazyTypography";

const __TABS__ = [
    {
        key: "work",
        i18nKey: "tab.profile.work",
        onClick: ({ navigate }) => {
            navigate.replace({
                pathname: "/profile",
                mode: "main",
            });
        },
    },
    {
        key: "history",
        i18nKey: "tab.profile.history",
        onClick: ({ navigate }) => {
            navigate.replace({
                pathname: `/profile/history`,
                mode: "main",
            });
        },
    },
    {
        key: "information",
        i18nKey: "tab.profile.information",
        onClick: ({ navigate }) => {
            navigate.replace({
                pathname: "/profile/information",
                mode: "main",
            });
        },
    },
];

const __EXPAND__ = [
    {
        key: "edit_profile",
        i18nKey: "text.profile.expand.edit_profile",
        icon: <EditIcon />,
        onClick: ({ navigate }) => {
            navigate.push({
                pathname: "/profile/edit",
                mode: "sub",
                screenTitle: "text.profile.expand.edit_profile",
            });
        },
    },
    {
        key: "share",
        i18nKey: "text.profile.expand.share",
        icon: <ShareIcon />,
        onClick: ({ modal }) => {
            modal.displayModal({
                pathname: "profile/Share",
                params: {},
                options: {
                    title: "title.profile.share",
                    layout: "responsive",
                },
            });
        },
    },
];

const Profile = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigateContext();
    const { userInfo } = useAuthContext();
    const modal = useModalContext();
    const [curTab, setCurTab] = React.useState(null);
    const [openExpand, setOpenExpand] = React.useState(false);
    const tabRefs = {
        work: React.useRef(null),
        history: React.useRef(null),
        information: React.useRef(null),
    };

    React.useEffect(() => {
        const tabs = __TABS__.map((x) => x.key);
        let _tab = tabs?.[0];
        tabs.forEach((tab) => {
            if (location.pathname.split("/").includes(tab)) {
                _tab = tab;
                return;
            }
        });
        return setCurTab(_tab);
    }, [location.pathname]);

    return (
        <>
            <main className="pages-protected-profile">
                <div className="profile-wrap">
                    <header>
                        <RippleEffect
                            onClick={() => {
                                navigate.push({
                                    pathname: "/profile/setup",
                                    mode: "sub",
                                });
                            }}
                        >
                            <div className="gear-icon"></div>
                        </RippleEffect>
                        <RippleEffect
                            onClick={() => setOpenExpand(!openExpand)}
                        >
                            <div className="dots-vertical-icon"></div>
                        </RippleEffect>
                    </header>
                    <div className="profile">
                        <div className="profile-container">
                            <div className="profile-thumbnail">
                                <LazyImage
                                    src={userInfo?.profileThumbnailUrl}
                                    alt="profile thumbnail"
                                />
                            </div>
                            <div className="profile-info">
                                <span className="nickname">
                                    <LazyTypography
                                        width={160}
                                        fontSize="1.125rem"
                                    >
                                        {userInfo?.nickname}
                                    </LazyTypography>
                                </span>
                                <span className="position">
                                    <LazyTypography
                                        width={200}
                                        fontSize="0.875rem"
                                    >
                                        {userInfo?.position}
                                    </LazyTypography>
                                </span>
                                <div className="counts">
                                    <div className="thumb-up">
                                        <div className="icon" />
                                        <span className="count">0</span>
                                    </div>
                                    <div className="follow-to">
                                        <div className="icon" />
                                        <span className="count">0</span>
                                    </div>
                                    <div className="follow-from">
                                        <div className="icon" />
                                        <span className="count">0</span>
                                    </div>
                                </div>
                            </div>
                            <span className="name-small">
                                {userInfo?.nickname || "loading"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="info">
                    <nav className="tabs">
                        <ul>
                            {__TABS__.map((tab) => (
                                <li
                                    key={tab.key}
                                    className={`${
                                        curTab === tab.key && "selected"
                                    }`}
                                    ref={tabRefs[tab.key]}
                                >
                                    <CommonButton
                                        type="text"
                                        color="black"
                                        onClick={() =>
                                            tab.onClick({ navigate })
                                        }
                                    >
                                        {t(tab.i18nKey)}
                                    </CommonButton>
                                </li>
                            ))}
                            <div
                                className="indicator"
                                style={{
                                    width: `${tabRefs?.[curTab]?.current?.offsetWidth}px`,
                                    transform: `translateX(calc(${Object.values(
                                        tabRefs
                                    )
                                        .slice(
                                            0,
                                            Object.values(__TABS__).findIndex(
                                                (x) => x.key === curTab
                                            )
                                        )
                                        .reduce(
                                            (previousValue, currentValue) =>
                                                previousValue +
                                                    currentValue.current
                                                        ?.offsetWidth || 0,
                                            0
                                        )}px + ${
                                        2 *
                                        Object.values(__TABS__).findIndex(
                                            (x) => x.key === curTab
                                        )
                                    }em))`,
                                }}
                            />
                        </ul>
                    </nav>
                    <Outlet context={{ userInfo }} />
                </div>
            </main>
            <BottomSheet
                open={openExpand}
                onDismiss={() => setOpenExpand(false)}
            >
                <div className="bottom-sheet expand">
                    {__EXPAND__.map((button) => (
                        <CommonButton
                            key={button.key}
                            type="contrast"
                            icon={button.icon}
                            className={button.key}
                            onClick={() => {
                                setOpenExpand(false);
                                button.onClick({ navigate, modal });
                            }}
                        >
                            <span>{t(button.i18nKey)}</span>
                        </CommonButton>
                    ))}
                </div>
            </BottomSheet>
        </>
    );
};

export default Profile;

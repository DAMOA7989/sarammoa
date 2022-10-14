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
import ProfileThumbnail from "components/surface/LazyImage";

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

const __EXPAND_BUTTONS__ = [
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
    const prevTouchPosition = React.useRef([0, 0]);
    const [touchPosition, setTouchPosition] = React.useState([0, 0]);
    const tabRefs = {
        work: React.useRef(null),
        history: React.useRef(null),
        information: React.useRef(null),
    };
    const originalProfileSizeRef = React.useRef([0, 0]);
    const originalProfileInfoSizeRef = React.useRef([0, 0]);
    const profileWrapRef = React.useRef(null);
    const profileRef = React.useRef(null);
    const profileContainerRef = React.useRef(null);
    const profileThumbnailRef = React.useRef(null);
    const profileInfoRef = React.useRef(null);
    const profileSmallNameRef = React.useRef(null);
    const profileInfoNavRef = React.useRef(null);
    const profileInfoNavIndicatorRef = React.useRef(null);
    const infoRef = React.useRef(null);

    React.useEffect(() => {
        const processTouchstart = (event) => {
            const touch = event.touches?.[0] || event.changedTouches?.[0];
            setTouchPosition([touch.clientX, touch.clientY]);
            profileRef.current.style.transition = ``;
            profileThumbnailRef.current.style.transition = ``;
            profileInfoRef.current.style.transition = ``;
            profileInfoNavRef.current.style.transition = ``;
            profileContainerRef.current.style.transition = ``;
            profileSmallNameRef.current.style.transition = ``;
        };

        const processTouchmove = (event) => {
            // event.preventDefault();
            const touch = event.touches?.[0] || event.changedTouches?.[0];
            if (!infoRef.current.contains(event.target)) return;
            setTouchPosition([touch.clientX, touch.clientY]);
        };

        const processTouchcancel = (event) => {
            const touch = event.touches?.[0] || event.changedTouches?.[0];
        };

        const processTouchend = (event) => {
            const touch = event.touches?.[0] || event.changedTouches?.[0];
            profileRef.current.style.transition = `height 1s`;
            profileThumbnailRef.current.style.transition = `top 1s, left 1s, width 1s, height 1s, transform 1s`;
            profileInfoRef.current.style.transition = `transform 1s, opacity .5s`;
            profileInfoNavRef.current.style.transition = `padding 1s`;
            profileContainerRef.current.style.transition = `padding 1s`;
            profileSmallNameRef.current.style.transition = `opacity .5s, transform 1s`;
            setTouchPosition([0, 0]);
        };

        window.document.addEventListener("touchstart", processTouchstart);
        window.document.addEventListener("touchmove", processTouchmove);
        window.document.addEventListener("touchcancel", processTouchcancel);
        window.document.addEventListener("touchend", processTouchend);

        return () => {
            window.document.removeEventListener(
                "touchstart",
                processTouchstart
            );
            window.document.removeEventListener("touchmove", processTouchmove);
            window.document.removeEventListener(
                "touchcancel",
                processTouchcancel
            );
            window.document.removeEventListener("touchend", processTouchend);
        };
    }, []);

    React.useEffect(() => {
        profileContainerRef.current.style.paddingBottom = `${
            (profileInfoRef.current.offsetHeight + 24) * 0.0625
        }em`;
        originalProfileInfoSizeRef.current = [
            profileInfoRef.current.offsetWidth,
            profileInfoRef.current.offsetHeight,
        ];

        originalProfileSizeRef.current = [
            profileRef.current.offsetWidth,
            profileRef.current.offsetHeight,
        ];
    }, []);

    React.useEffect(() => {
        if (
            touchPosition[0] === 0 &&
            touchPosition[1] === 0 &&
            (prevTouchPosition.current?.[0] !== 0 ||
                prevTouchPosition.current?.[1] !== 0)
        ) {
            const curHeight = profileRef.current.offsetHeight;

            if (curHeight >= originalProfileSizeRef.current?.[1] / 2) {
                profileRef.current.style.height = `${
                    originalProfileSizeRef.current?.[1] * 0.0625
                }em`;
                profileContainerRef.current.style.paddingBottom = `${
                    (originalProfileInfoSizeRef.current?.[1] + 24) * 0.0625
                }em`;
                profileInfoRef.current.style.opacity = "1";
                // profileInfoRef.current.style.display = "inline-flex";
                profileInfoRef.current.style.transform = `translateX(0em)`;
                profileInfoNavRef.current.style.paddingTop = `${24 * 0.0625}em`;
                profileWrapRef.current.style.backgroundColor = `${styles.appBackgroundColor}`;
                profileThumbnailRef.current.style.width = `${8.5}em`;
                profileThumbnailRef.current.style.height = `${8.5}em`;
                profileThumbnailRef.current.style.top = "0";
                profileThumbnailRef.current.style.transform = `translateX(0em)`;
                profileSmallNameRef.current.style.opacity = "0";
                profileSmallNameRef.current.style.transform = `translateX(${
                    (originalProfileSizeRef.current?.[0] / 2 -
                        profileSmallNameRef.current.offsetWidth / 2) *
                    0.0625
                }em) scale(0.5) translateY(${3 * 0.0625}em)`;
            } else {
                profileRef.current.style.height = `0em`;
                profileContainerRef.current.style.paddingBottom = "0em";
                profileInfoRef.current.style.opacity = "0";
                // profileInfoRef.current.style.display = "none";
                profileInfoRef.current.style.transform = `translateX(${
                    (originalProfileSizeRef.current?.[0] / 2 -
                        profileInfoRef.current.offsetWidth / 2 -
                        68) *
                    0.0625
                }em)`;
                profileInfoNavRef.current.style.paddingTop = "0";
                profileWrapRef.current.style.backgroundColor = "white";
                profileThumbnailRef.current.style.width = `${4.25}em`;
                profileThumbnailRef.current.style.height = `${4.25}em`;
                profileThumbnailRef.current.style.marginBottom = "0";
                profileThumbnailRef.current.style.top = `${-15 * 0.0625}em`;
                profileThumbnailRef.current.style.transform = `translateX(${
                    (-originalProfileSizeRef.current?.[0] / 2 + 30 + 68) *
                    0.0625
                }em)`;
                profileSmallNameRef.current.style.opacity = "1";
                profileSmallNameRef.current.style.transform = `translateX(0em) scale(1) translateY(${
                    3 * 0.0625
                }em)`;
            }
            prevTouchPosition.current = [0, 0];
            return;
        }
        if (touchPosition[0] === 0 && touchPosition[1] === 0) return;
        if (
            prevTouchPosition.current?.[0] === 0 &&
            prevTouchPosition.current?.[1] === 0
        ) {
            prevTouchPosition.current = touchPosition;
            return;
        }

        const nextHeight =
            profileRef.current.offsetHeight -
            prevTouchPosition.current?.[1] +
            touchPosition?.[1];
        profileRef.current.style.height = `${nextHeight * 0.0625}em`;
        let curHeightRatio = nextHeight / originalProfileSizeRef.current?.[1];
        curHeightRatio =
            curHeightRatio < 0 ? 0 : curHeightRatio > 1 ? 1 : curHeightRatio;

        profileContainerRef.current.style.paddingBottom = `${
            (originalProfileInfoSizeRef.current?.[1] * curHeightRatio + 24) *
            0.0625
        }em`;
        profileInfoRef.current.style.opacity = `${
            curHeightRatio - 0.3 > 0 ? curHeightRatio - 0.3 : 0
        }`;
        profileInfoRef.current.style.transform = `translateX(${
            (originalProfileSizeRef.current?.[0] / 2 -
                profileInfoRef.current.offsetWidth / 2 -
                68) *
            (1 - curHeightRatio) *
            0.0625
        }em)`;
        profileThumbnailRef.current.style.width = `${
            (60 + 60 * curHeightRatio) * 0.0625
        }em`;
        profileThumbnailRef.current.style.height = `${
            (60 + 60 * curHeightRatio) * 0.0625
        }em`;
        profileThumbnailRef.current.style.top = `${
            -15 * curHeightRatio * 0.0625
        }em`;
        profileThumbnailRef.current.style.transform = `translateX(${
            (-originalProfileSizeRef.current?.[0] / 2 +
                profileThumbnailRef.current.offsetWidth / 2 +
                68) *
            (1 - curHeightRatio) *
            0.0625
        }em)`;
        profileInfoNavRef.current.style.paddingTop = `${
            24 * curHeightRatio * 0.0625
        }em`;
        profileSmallNameRef.current.style.opacity = `${
            1 - curHeightRatio * 2 < 0 ? 0 : 1 - curHeightRatio * 2
        }`;
        profileSmallNameRef.current.style.transform = `translateX(${
            (originalProfileSizeRef.current?.[0] / 2 -
                profileSmallNameRef.current.offsetWidth / 2) *
            curHeightRatio *
            0.0625
        }em) scale(${0.5 + (0.5 - curHeightRatio / 2)}) translateY(${
            3 * 0.0625
        }em)`;

        prevTouchPosition.current = touchPosition;
    }, [touchPosition]);

    React.useEffect(() => {
        if (!profileInfoNavIndicatorRef.current) return;
        if (profileInfoNavIndicatorRef.current.offsetWidth > 0) {
            profileInfoNavIndicatorRef.current.style.transition =
                "width 0.3s, transform 0.3s";
        }
    }, [profileInfoNavIndicatorRef.current]);

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
                <div ref={profileWrapRef} className="profile-wrap">
                    <header>
                        <div
                            className="gear-icon"
                            onClick={() => {
                                navigate.push({
                                    pathname: "/profile/setup",
                                    mode: "sub",
                                });
                            }}
                        ></div>
                        <div
                            className="dots-vertical-icon"
                            onClick={() => setOpenExpand(!openExpand)}
                        ></div>
                    </header>
                    <div ref={profileRef} className="profile">
                        <div
                            ref={profileContainerRef}
                            className="profile-container"
                        >
                            <div
                                ref={profileThumbnailRef}
                                className="profile-thumbnail-outline"
                            >
                                <div className="profile-thumbnail">
                                    <ProfileThumbnail
                                        src={userInfo?.profileThumbnailUrl}
                                        alt="profile thumbnail"
                                    />
                                </div>
                            </div>
                            <div ref={profileInfoRef} className="profile-info">
                                <span className="name">
                                    {userInfo?.nickname || (
                                        <Skeleton
                                            variant="text"
                                            width={120}
                                            sx={{
                                                fontSize: "1.125rem",
                                            }}
                                        />
                                    )}
                                </span>
                                <span className="position">
                                    {userInfo?.position || (
                                        <Skeleton
                                            variant="text"
                                            width={45}
                                            sx={{
                                                fontSize: "0.875rem",
                                            }}
                                        />
                                    )}
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
                            <span
                                ref={profileSmallNameRef}
                                className="name-small"
                            >
                                {userInfo?.nickname || "loading"}
                            </span>
                        </div>
                    </div>
                </div>
                <div ref={infoRef} className="info">
                    <nav ref={profileInfoNavRef} className="tabs">
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
                                ref={profileInfoNavIndicatorRef}
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
                    {__EXPAND_BUTTONS__.map((button) => (
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

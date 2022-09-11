import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Outlet, useLocation, useMatch } from "react-router-dom";
import styles from "styles/include.scss";
import { useNavigateContext } from "utils/navigate";

const __TABS__ = [
    {
        key: "history",
        i18nKey: "tab.profile.history",
        onClick: ({ push }) => {
            push({
                pathname: `/profile`,
                mode: "main",
            });
        },
    },
    {
        key: "information",
        i18nKey: "tab.profile.information",
        onClick: ({ push }) => {
            push({
                pathname: "/profile/information",
                mode: "main",
            });
        },
    },
    {
        key: "etc",
        i18nKey: "tab.profile.etc",
        onClick: ({ push }) => {
            push({
                pathname: "/profile/etc",
                mode: "main",
            });
        },
    },
];

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { push } = useNavigateContext();
    const [curTab, setCurTab] = React.useState(null);
    const prevTouchPosition = React.useRef([0, 0]);
    const [touchPosition, setTouchPosition] = React.useState([0, 0]);
    const tabRefs = {
        history: React.useRef(null),
        information: React.useRef(null),
        etc: React.useRef(null),
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
            event.preventDefault();
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
                profileThumbnailRef.current.style.width = `${120 * 0.0625}em`;
                profileThumbnailRef.current.style.height = `${120 * 0.0625}em`;
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
                profileThumbnailRef.current.style.width = `${60 * 0.0625}em`;
                profileThumbnailRef.current.style.height = `${60 * 0.0625}em`;
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
        switch (location.pathname.split("/")?.[2]) {
            case "information":
                setCurTab("information");
                break;
            case "etc":
                setCurTab("etc");
                break;
            default:
                setCurTab("history");
                break;
        }
    }, [location.pathname]);

    return (
        <main className="pages-protected-profile">
            <div ref={profileWrapRef} className="profile-wrap">
                <header>
                    <div
                        className="gear-icon"
                        onClick={() => {
                            push({
                                pathname: "/profile/setup",
                                mode: "sub",
                                screenTitle: "title.screen.setup",
                            });
                        }}
                    ></div>
                    <div className="dots-vertical-icon"></div>
                </header>
                <div ref={profileRef} className="profile">
                    <div
                        ref={profileContainerRef}
                        className="profile-container"
                    >
                        <div
                            ref={profileThumbnailRef}
                            className="profile-thumbnail"
                            style={{
                                backgroundImage: `url('https://www.bentbusinessmarketing.com/wp-content/uploads/2013/02/35844588650_3ebd4096b1_b-1024x683.jpg')`,
                            }}
                        ></div>
                        <div ref={profileInfoRef} className="profile-info">
                            <span className="name">Walter Yoon</span>
                            <span className="position">
                                Javascript Developer
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
                        <span ref={profileSmallNameRef} className="name-small">
                            Walter Yoon
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
                                <button
                                    className={`text-button active primary`}
                                    onClick={() => tab.onClick({ push })}
                                >
                                    {t(tab.i18nKey)}
                                </button>
                            </li>
                        ))}
                        <div
                            className="indicator"
                            style={{
                                width:
                                    `${
                                        tabRefs?.[curTab]?.current
                                            ?.offsetWidth * 0.0625
                                    }em` || "0em",
                            }}
                        />
                    </ul>
                </nav>
                <Outlet />
            </div>
        </main>
    );
};

export default Profile;

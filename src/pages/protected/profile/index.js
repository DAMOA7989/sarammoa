import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const __TABS__ = [
    {
        key: "history",
        i18nKey: "tab.profile.history",
        onClick: ({ navigate }) => {
            navigate("");
        },
    },
    {
        key: "information",
        i18nKey: "tab.profile.information",
        onClick: ({ navigate }) => {
            navigate("information");
        },
    },
    {
        key: "etc",
        i18nKey: "tab.profile.etc",
        onClick: ({ navigate }) => {
            navigate("etc");
        },
    },
];

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [curTab, setCurTab] = React.useState(null);
    const prevTouchPosition = React.useRef([0, 0]);
    const [touchPosition, setTouchPosition] = React.useState([0, 0]);
    const tabRefs = {
        history: React.useRef(null),
        information: React.useRef(null),
        etc: React.useRef(null),
    };
    const originalProfileSizeRef = React.useRef([0, 0]);
    const profileRef = React.useRef(null);
    const infoRef = React.useRef(null);

    React.useEffect(() => {
        const processTouchstart = (event) => {
            const touch = event.touches?.[0] || event.changedTouches?.[0];
            setTouchPosition([touch.clientX, touch.clientY]);
            profileRef.current.style.transition = ``;
        };

        const processTouchmove = (event) => {
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
        if (!profileRef.current) return;
        if (
            originalProfileSizeRef.current?.[0] !== 0 ||
            originalProfileSizeRef.current?.[1] !== 0
        )
            return;
        originalProfileSizeRef.current = [
            profileRef.current.offsetWidth,
            profileRef.current.offsetHeight,
        ];
    }, [profileRef.current]);

    React.useEffect(() => {
        if (
            touchPosition[0] === 0 &&
            touchPosition[1] === 0 &&
            (prevTouchPosition.current?.[0] !== 0 ||
                prevTouchPosition.current?.[1] !== 0)
        ) {
            const curHeight = profileRef.current.offsetHeight;

            if (curHeight >= originalProfileSizeRef.current?.[1] / 2) {
                profileRef.current.style.height = `${originalProfileSizeRef.current?.[1]}px`;
            } else {
                profileRef.current.style.height = `0px`;
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

        profileRef.current.style.height = `${
            profileRef.current.offsetHeight -
            prevTouchPosition.current?.[1] +
            touchPosition?.[1]
        }px`;
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
            <div className="profile-wrap">
                <header>
                    <div className="gear-icon"></div>
                    <div className="dots-vertical-icon"></div>
                </header>
                <div ref={profileRef} className="profile">
                    <div className="profile-container">
                        <div
                            className="profile-thumbnail"
                            style={{
                                backgroundImage: `url('https://www.bentbusinessmarketing.com/wp-content/uploads/2013/02/35844588650_3ebd4096b1_b-1024x683.jpg')`,
                            }}
                        ></div>
                        <span className="name">Walter Yoon</span>
                        <span className="position">Javascript Developer</span>
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
                </div>
            </div>
            <div ref={infoRef} className="info">
                <nav className="tabs">
                    <ul>
                        {__TABS__.map((tab) => (
                            <li
                                className={`${
                                    curTab === tab.key && "selected"
                                }`}
                                ref={tabRefs[tab.key]}
                            >
                                <button
                                    className={`text-button active primary`}
                                    onClick={() => tab.onClick({ navigate })}
                                >
                                    {t(tab.i18nKey)}
                                </button>
                            </li>
                        ))}
                        <div
                            className="indicator"
                            style={{
                                width:
                                    `${tabRefs?.[curTab]?.current?.offsetWidth}px` ||
                                    "0px",
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

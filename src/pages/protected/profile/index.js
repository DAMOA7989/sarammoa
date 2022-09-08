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
    const [curTab, setCurTab] = React.useState("history");
    const tabRefs = {
        history: React.useRef(null),
        information: React.useRef(null),
        etc: React.useRef(null),
    };

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
            <div className="profile">
                <header>
                    <div className="gear-icon"></div>
                    <div className="dots-vertical-icon"></div>
                </header>
                <div className="profile">
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
            <div className="info">
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

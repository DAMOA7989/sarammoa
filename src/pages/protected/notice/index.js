import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigateContext } from "utils/navigate";

const __TABS__ = [
    {
        key: "message",
        i18nKey: "title.notice.tab.message",
        onClick: ({ navigate }) => {
            navigate.push({
                pathname: "/notice",
                mode: "main",
            });
        },
    },
    {
        key: "notification",
        i18nKey: "title.notice.tab.notification",
        onClick: ({ navigate }) => {
            navigate.push({
                pathname: "/notice/notification",
                mode: "main",
            });
        },
    },
];

const Notice = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigateContext();
    const [curTab, setCurTab] = React.useState(null);
    const tabRef = React.useRef(null);

    React.useEffect(() => {
        switch (location.pathname.split("/")?.[2]) {
            case "notification":
                setCurTab("notification");
                break;
            default:
                setCurTab("message");
                break;
        }
    }, [location.pathname]);

    return (
        <main className="pages-protected-notice">
            <nav className="tabs">
                <ul>
                    {__TABS__.map((tab) => (
                        <li
                            key={tab.key}
                            ref={tabRef}
                            className={`${curTab === tab.key && "selected"}`}
                        >
                            <div
                                className="container"
                                onClick={() => tab.onClick({ navigate })}
                            >
                                {t(tab.i18nKey)}
                            </div>
                        </li>
                    ))}
                    <div
                        className="indicator"
                        style={{
                            width: tabRef.current?.offsetWidth,
                        }}
                    />
                </ul>
            </nav>
            <Outlet />
        </main>
    );
};

export default Notice;

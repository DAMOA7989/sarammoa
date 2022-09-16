import React from "react";
import { useTranslation } from "react-i18next";
import NotificationCard from "components/surface/NotificationCard";

const Notification = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = React.useState([]);

    React.useEffect(() => {
        setNotifications([
            {
                userInfo: {
                    id: 0,
                    nickname: "SARAMMOA",
                    profileThumbnailUrl:
                        "https://play-lh.googleusercontent.com/1zfN_BL13q20v0wvBzMWiZ_sL_t4KcCJBeAMRpOZeT3p34quM-4-pO-VcLj8PJNXPA0",
                },
                message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                date: "2022.09.16 16:23",
            },
            {
                userInfo: {
                    id: 0,
                    nickname: "SARAMMOA",
                    profileThumbnailUrl:
                        "https://play-lh.googleusercontent.com/1zfN_BL13q20v0wvBzMWiZ_sL_t4KcCJBeAMRpOZeT3p34quM-4-pO-VcLj8PJNXPA0",
                },
                message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                date: "2022.09.16 16:23",
            },
        ]);
    }, []);

    return (
        <div className="pages-protected-notice-notification">
            <ul className="notifications">
                {(notifications || []).map((notification, idx) => (
                    <li key={idx}>
                        <NotificationCard
                            user={notification?.userInfo}
                            message={notification?.message}
                            date={notification?.date}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notification;

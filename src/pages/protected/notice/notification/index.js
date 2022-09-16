import React from "react";
import { useTranslation } from "react-i18next";

const Notification = () => {
    const { t } = useTranslation();

    return (
        <div className="pages-protected-notice-notification">notification</div>
    );
};

export default Notification;

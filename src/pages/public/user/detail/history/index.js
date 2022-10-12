import React from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

const UserDetailHistory = () => {
    const { t } = useTranslation();
    const { userInfo } = useOutletContext();

    return <div className="user-detail-history">history</div>;
};

export default UserDetailHistory;

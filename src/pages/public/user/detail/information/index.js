import React from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

const UserDetailInformation = () => {
    const { t } = useTranslation();
    const { userInfo } = useOutletContext();

    return <div className="user-detail-information">information</div>;
};

export default UserDetailInformation;

import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const Detail = () => {
    const { t } = useTranslation();
    const { uid } = useParams();

    return <main className="pages-public-user-detail">uid: {uid}</main>;
};

export default Detail;

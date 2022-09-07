import React from "react";
import { useTranslation } from "react-i18next";

const NewsFeed = () => {
    const { t } = useTranslation();

    return <main>news feed {t("test")}</main>;
};

export default NewsFeed;

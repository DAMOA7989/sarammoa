import React from "react";
import { useTranslation } from "react-i18next";

const __DATAS__ = {
    entire: {
        views: {
            i18nKey: "title.profile.information.views",
            count: () => {
                return 0;
            },
            onClick: () => {},
        },
        likes: {
            i18nKey: "title.profile.information.appreciations",
            count: () => {
                return 0;
            },
            onClick: () => {},
        },
        comments: {
            i18nKey: "title.profile.information.comments",
            count: () => {
                return 0;
            },
            onClick: () => {},
        },
        profileViews: {
            i18nKey: "title.profile.information.profile_views",
            count: () => {
                return 0;
            },
            onClick: () => {},
        },
    },
    today: {
        views: {
            i18nKey: "title.profile.information.views",
            count: () => {
                return 0;
            },
            onClick: () => {},
        },
        likes: {
            i18nKey: "title.profile.information.appreciations",
            count: () => {
                return 0;
            },
            onClick: () => {},
        },
        comments: {
            i18nKey: "title.profile.information.comments",
            count: () => {
                return 0;
            },
            onClick: () => {},
        },
        profileViews: {
            i18nKey: "title.profile.information.profile_views",
            count: () => {
                return 0;
            },
            onClick: () => {},
        },
    },
};

const Statistic = ({ uid }) => {
    const { t } = useTranslation();

    return (
        <main className="modals-profile-statistic">
            {Object.entries(__DATAS__ || {}).map(([key, value], idx) => (
                <div className={`period ${key}`}>
                    <h1 className={`title`}>
                        {t(`title.profile.information.${key}`)}
                    </h1>
                    <ul>
                        {Object.entries(value || {}).map(
                            ([key2, value2], idx) => (
                                <li key={`${key}-${key2}`}>
                                    <div className="container">
                                        <span className="count">
                                            {value2.count()}
                                        </span>
                                        <span className="label">
                                            {t(value2.i18nKey)}
                                        </span>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            ))}
        </main>
    );
};

export default Statistic;

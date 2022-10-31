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

    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "FETCH_VIEWS_PENDING":
                    return {
                        ...state,
                        loading: true,
                    };
                case "FETCH_VIEWS_FULFILLED":
                    return {
                        ...state,
                        loading: false,
                        views: action.payload?.docs,
                    };
                case "FETCH_VIEWS_REJECTED":
                    return {
                        ...state,
                        loading: false,
                    };
                case "FETCH_LIKES_PENDING":
                    return {
                        ...state,
                        loading: true,
                    };
                case "FETCH_LIKES_FULFILLED":
                    return {
                        ...state,
                        loading: false,
                        likes: action.payload?.docs,
                    };
                case "FETCH_LIKES_REJECTED":
                    return {
                        ...state,
                        loading: false,
                    };
                case "FETCH_COMMENTS_PENDING":
                    return {
                        ...state,
                        loading: true,
                    };
                case "FETCH_COMMENTS_FULFILLED":
                    return {
                        ...state,
                        loading: false,
                        comments: action.payload?.docs,
                    };
                case "FETCH_COMMENTS_REJECTED":
                    return {
                        ...state,
                        loading: false,
                    };
                case "FETCH_PROFILE_VIEWS_PENDING":
                    return {
                        ...state,
                        loading: true,
                    };
                case "FETCH_PROFILE_VIEWS_FULFILLED":
                    return {
                        ...state,
                        loading: false,
                        profileViews: action.payload?.docs,
                    };
                case "FETCH_PROFILE_VIEWS_REJECTED":
                    return {
                        ...state,
                        loading: false,
                    };
            }
        },
        {
            loading: false,
            views: [],
            likes: [],
            comments: [],
            profileViews: [],
        }
    );

    React.useEffect(() => {}, []);

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

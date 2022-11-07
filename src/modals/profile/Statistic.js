import React from "react";
import { useTranslation } from "react-i18next";
import {
    _countTotalLikes,
    _countTotalViews,
    _getTotalComments,
    _getTotalProfileViews,
} from "utils/firebase/user";
import CountUp from "react-countup";

const __DATAS__ = {
    entire: {
        views: {
            i18nKey: "title.profile.information.views",
            count: ({ state }) => (state.views || []).length,
            onClick: () => {},
        },
        likes: {
            i18nKey: "title.profile.information.appreciations",
            count: ({ state }) => (state.likes || []).length,
            onClick: () => {},
        },
        comments: {
            i18nKey: "title.profile.information.comments",
            count: ({ state }) => (state.comments || []).length,
            onClick: () => {},
        },
        profileViews: {
            i18nKey: "title.profile.information.profile_views",
            count: ({ state }) => (state.profileViews || []).length,
            onClick: () => {},
        },
    },
    today: {
        views: {
            i18nKey: "title.profile.information.views",
            count: ({ state }) => {
                const filtered = (state.views || []).filter((x) => {
                    const viewDate = x.createdAt.toDate().getTime();
                    const beforeAnHourDate =
                        new Date().getTime() - 24 * 60 * 60 * 1000;

                    if (viewDate - beforeAnHourDate >= 0) return true;
                    return false;
                });

                return filtered.length;
            },
            onClick: () => {},
        },
        likes: {
            i18nKey: "title.profile.information.appreciations",
            count: ({ state }) => {
                const filtered = (state.likes || []).filter((x) => {
                    const viewDate = x.createdAt.toDate().getTime();
                    const beforeAnHourDate =
                        new Date().getTime() - 24 * 60 * 60 * 1000;

                    if (viewDate - beforeAnHourDate >= 0) return true;
                    return false;
                });

                return filtered.length;
            },
            onClick: () => {},
        },
        comments: {
            i18nKey: "title.profile.information.comments",
            count: ({ state }) => {
                const filtered = (state.comments || []).filter((x) => {
                    const viewDate = x.createdAt.toDate().getTime();
                    const beforeAnHourDate =
                        new Date().getTime() - 24 * 60 * 60 * 1000;

                    if (viewDate - beforeAnHourDate >= 0) return true;
                    return false;
                });

                return filtered.length;
            },
            onClick: () => {},
        },
        profileViews: {
            i18nKey: "title.profile.information.profile_views",
            count: ({ state }) => {
                const filtered = (state.profileViews || []).filter((x) => {
                    const viewDate = x.createdAt.toDate().getTime();
                    const beforeAnHourDate =
                        new Date().getTime() - 24 * 60 * 60 * 1000;

                    if (viewDate - beforeAnHourDate >= 0) return true;
                    return false;
                });

                return filtered.length;
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
                case "FETCH_PENDING":
                    return {
                        ...state,
                        loading: true,
                    };
                case "FETCH_FULFILLED":
                    return {
                        ...state,
                        loading: false,
                    };
                case "FETCH_REJECTED":
                    return {
                        ...state,
                        loading: false,
                    };
                case "FETCH_VIEWS_PENDING":
                    return {
                        ...state,
                        viewsLoading: true,
                    };
                case "FETCH_VIEWS_FULFILLED":
                    return {
                        ...state,
                        viewsLoading: false,
                        views: action.payload?.docs,
                    };
                case "FETCH_VIEWS_REJECTED":
                    return {
                        ...state,
                        viewsLoading: false,
                    };
                case "FETCH_LIKES_PENDING":
                    return {
                        ...state,
                        likesLoading: true,
                    };
                case "FETCH_LIKES_FULFILLED":
                    return {
                        ...state,
                        likesLoading: false,
                        likes: action.payload?.docs,
                    };
                case "FETCH_LIKES_REJECTED":
                    return {
                        ...state,
                        likesLoading: false,
                    };
                case "FETCH_COMMENTS_PENDING":
                    return {
                        ...state,
                        commentsLoading: true,
                    };
                case "FETCH_COMMENTS_FULFILLED":
                    return {
                        ...state,
                        commentsLoading: false,
                        comments: action.payload?.docs,
                    };
                case "FETCH_COMMENTS_REJECTED":
                    return {
                        ...state,
                        commentsLoading: false,
                    };
                case "FETCH_PROFILE_VIEWS_PENDING":
                    return {
                        ...state,
                        profileViewsLoading: true,
                    };
                case "FETCH_PROFILE_VIEWS_FULFILLED":
                    return {
                        ...state,
                        profileViewsLoading: false,
                        profileViews: action.payload?.docs,
                    };
                case "FETCH_PROFILE_VIEWS_REJECTED":
                    return {
                        ...state,
                        profileViewsLoading: false,
                    };
            }
        },
        {
            loading: true,
            viewsLoading: false,
            views: [],
            likesLoading: false,
            likes: [],
            commentsLoading: false,
            comments: [],
            profileViewsLoading: false,
            profileViews: [],
        }
    );

    React.useEffect(() => {
        dispatch({
            type: "FETCH_PENDING",
        });

        const tasks = [];
        dispatch({
            type: "FETCH_VIEWS_PENDING",
        });
        tasks.push(
            _countTotalViews({ uid })
                .then((docs) => {
                    dispatch({
                        type: "FETCH_VIEWS_FULFILLED",
                        payload: {
                            docs,
                        },
                    });
                })
                .catch((e) => {
                    console.dir(e);
                    dispatch({
                        type: "FETCH_VIEWS_REJECTED",
                    });
                })
        );

        dispatch({
            type: "FETCH_LIKES_PENDING",
        });
        tasks.push(
            _countTotalLikes({ uid })
                .then((docs) => {
                    dispatch({
                        type: "FETCH_LIKES_FULFILLED",
                        payload: {
                            docs,
                        },
                    });
                })
                .catch((e) => {
                    console.dir(e);
                    dispatch({
                        type: "FETCH_LIKES_REJECTED",
                    });
                })
        );

        dispatch({
            type: "FETCH_COMMENTS_PENDING",
        });
        tasks.push(
            _getTotalComments({ uid })
                .then((docs) => {
                    dispatch({
                        type: "FETCH_COMMENTS_FULFILLED",
                        payload: {
                            docs,
                        },
                    });
                })
                .catch((e) => {
                    console.dir(e);
                    dispatch({
                        type: "FETCH_COMMENTS_REJECTED",
                    });
                })
        );

        dispatch({
            type: "FETCH_PROFILE_VIEWS_PENDING",
        });
        tasks.push(
            _getTotalProfileViews({ uid })
                .then((docs) => {
                    dispatch({
                        type: "FETCH_PROFILE_VIEWS_FULFILLED",
                        payload: {
                            docs,
                        },
                    });
                })
                .catch((e) => {
                    console.dir(e);
                    dispatch({
                        type: "FETCH_PROFILE_VIEWS_REJECTED",
                    });
                })
        );

        Promise.all(tasks).then(() =>
            dispatch({
                type: "FETCH_FULFILLED",
            })
        );
    }, []);

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
                                        <CountUp
                                            start={0}
                                            end={value2.count({ state })}
                                            duration={0.7}
                                        >
                                            {({ countUpRef, start }) => (
                                                <>
                                                    <span
                                                        className="count"
                                                        ref={countUpRef}
                                                    ></span>
                                                    <span className="label">
                                                        {t(value2.i18nKey)}
                                                    </span>
                                                </>
                                            )}
                                        </CountUp>
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

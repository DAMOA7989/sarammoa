import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, Outlet, useLocation } from "react-router-dom";
import { _getUserInfo } from "utils/firebase/auth";
import LazyImage from "components/surface/LazyImage";
import LazyTypography from "components/surface/LazyTypography";
import RippleEffect from "components/surface/RippleEffect";
import { ReactComponent as DotsVerticalIcon } from "assets/images/icons/dots_vertical.svg";
import { ReactComponent as ThumbUpIcon } from "assets/images/icons/thumb_up.svg";
import { ReactComponent as FollowInIcon } from "assets/images/icons/follow_from.svg";
import { ReactComponent as FollowOutIcon } from "assets/images/icons/follow_to.svg";
import CommonButton from "components/button/CommonButton";
import { useNavigateContext } from "utils/navigate";
import { _follow, _unfollow } from "utils/firebase/user";
import { useAuthContext } from "utils/auth";
import { _isFollow } from "utils/firebase/user";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useModalContext } from "utils/modal";
import { ReactComponent as ShareIcon } from "assets/images/icons/profile/share.svg";
import { ReactComponent as ReportIcon } from "assets/images/icons/profile/report.svg";

const __TABS__ = [
    {
        key: "work",
        i18nKey: "tab.profile.work",
        onClick: ({ uid, location, navigate }) => {
            if (location.pathname?.split?.("/")?.[1] === "sub") {
                navigate.replace({
                    pathname: `/user/${uid}`,
                    mode: "sub",
                });
            } else if (location.pathname?.split?.("/")?.[1] === "publish") {
                navigate.replace({
                    pathname: `/user/${uid}`,
                    mode: "publish",
                });
            }
        },
    },
    {
        key: "history",
        i18nKey: "tab.profile.history",
        onClick: ({ uid, location, navigate }) => {
            if (location.pathname?.split?.("/")?.[1] === "sub") {
                navigate.replace({
                    pathname: `/user/${uid}/history`,
                    mode: "sub",
                });
            } else if (location.pathname?.split?.("/")?.[1] === "publish") {
                navigate.replace({
                    pathname: `/user/${uid}/history`,
                    mode: "publish",
                });
            }
        },
    },
    {
        key: "information",
        i18nKey: "tab.profile.information",
        onClick: ({ uid, location, navigate }) => {
            if (location.pathname?.split?.("/")?.[1] === "sub") {
                navigate.replace({
                    pathname: `/user/${uid}/information`,
                    mode: "sub",
                });
            } else if (location.pathname?.split?.("/")?.[1] === "publish") {
                navigate.replace({
                    pathname: `/user/${uid}/information`,
                    mode: "publish",
                });
            }
        },
    },
];

const __EXPAND__ = [
    {
        key: "share",
        i18nKey: "text.profile.expand.share",
        icon: <ShareIcon />,
        onClick: ({ modal, userInfo }) => {
            modal.displayModal({
                pathname: "profile/Share",
                params: {
                    userInfo,
                },
                options: {
                    title: "title.profile.share",
                    layout: "responsive",
                },
            });
        },
    },
    {
        key: "report",
        i18nKey: "text.dropdown.report",
        icon: <ReportIcon />,
        onClick: () => {},
    },
];

const UserDetail = () => {
    const { t } = useTranslation();
    const { uid } = useParams();
    const navigate = useNavigateContext();
    const { userInfo } = useAuthContext();
    const modal = useModalContext();
    const location = useLocation();
    const tabRefs = {
        work: React.useRef(null),
        history: React.useRef(null),
        information: React.useRef(null),
    };
    const indicatorRef = React.useRef(null);
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_USER_INFO_PENDING":
                    return {
                        ...state,
                        userInfoLoading: true,
                        userInfo: null,
                    };
                case "SET_USER_INFO_FULFILLED":
                    return {
                        ...state,
                        userInfoLoading: false,
                        userInfo: action.payload?.doc,
                    };
                case "SET_USER_INFO_REJECTED":
                    return {
                        ...state,
                        userInfoLoading: false,
                        userInfo: null,
                    };
                case "SET_CUR_TAB":
                    return {
                        ...state,
                        curTab: action.payload?.tab,
                    };
                case "IS_FOLLOW":
                    return {
                        ...state,
                        follow: true,
                    };
                case "FOLLOW_PENDING":
                    return {
                        ...state,
                        followLoading: true,
                    };
                case "FOLLOW_FULFILLED":
                    return {
                        ...state,
                        followLoading: false,
                        follow: true,
                    };
                case "FOLLOW_REJECTED":
                    return {
                        ...state,
                        followLoading: false,
                    };
                case "UNFOLLOW_PENDING":
                    return {
                        ...state,
                        followLoading: true,
                    };
                case "UNFOLLOW_FULFILLED":
                    return {
                        ...state,
                        followLoading: false,
                        follow: false,
                    };
                case "UNFOLLOW_REJECTED":
                    return {
                        ...state,
                        followLoading: false,
                    };
                case "OPEN_EXPAND":
                    return {
                        ...state,
                        openExpand: true,
                    };
                case "CLOSE_EXPAND":
                    return {
                        ...state,
                        openExpand: false,
                    };
            }
        },
        {
            userInfoLoading: false,
            userInfo: null,
            curTab: null,
            followLoading: false,
            follow: false,
            openExpand: false,
        }
    );

    React.useEffect(() => {
        if (!Boolean(userInfo?.id) || !Boolean(uid)) return;
        _isFollow({ from: userInfo?.id, to: uid })
            .then((flag) => {
                if (flag) {
                    dispatch({
                        type: "IS_FOLLOW",
                    });
                }
            })
            .catch((e) => {
                console.dir(e);
            });
    }, [userInfo?.id, uid]);

    React.useEffect(() => {
        const tabs = __TABS__.map((x) => x.key);
        let _tab = tabs?.[0];
        tabs.forEach((tab) => {
            if (location.pathname.split("/").includes(tab)) {
                _tab = tab;
                return;
            }
        });
        return dispatch({
            type: "SET_CUR_TAB",
            payload: {
                tab: _tab,
            },
        });
    }, [location.pathname]);

    React.useEffect(() => {
        if (!Boolean(uid)) return;

        dispatch({ type: "SET_USER_INFO_PENDING" });
        _getUserInfo({ uid })
            .then((doc) => {
                dispatch({
                    type: "SET_USER_INFO_FULFILLED",
                    payload: {
                        doc,
                    },
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({ type: "SET_USER_INFO_REJECTED" });
            });
    }, [uid]);

    React.useEffect(() => {
        if (!indicatorRef.current) return;
        if (indicatorRef.current.offsetWidth > 0) {
            // indicatorRef.current.style.transition =
            //     "width 0.3s, transform 0.3s";
        }
    }, [indicatorRef.current]);

    const onFollowHandler = () => {
        dispatch({
            type: "FOLLOW_PENDING",
        });

        _follow({ from: userInfo?.id, to: uid })
            .then(() => {
                dispatch({
                    type: "FOLLOW_FULFILLED",
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "UNFOLLOW_REJECTED",
                });
            });
    };

    const onUnfollowHandler = () => {
        dispatch({
            type: "UNFOLLOW_PENDING",
        });

        _unfollow({ from: userInfo?.id, to: uid })
            .then(() => {
                dispatch({
                    type: "UNFOLLOW_FULFILLED",
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "UNFOLLOW_REJECTED",
                });
            });
    };

    return (
        <>
            <main className="pages-public-user-detail">
                <header className="header">
                    <RippleEffect
                        onClick={() => dispatch({ type: "OPEN_EXPAND" })}
                    >
                        <DotsVerticalIcon />
                    </RippleEffect>
                </header>
                <div className="user">
                    <div className="profile-thumbnail">
                        <LazyImage
                            src={state.userInfo?.profileThumbnailUrl}
                            alt="profile thumbnail"
                        />
                    </div>
                    <div className="info">
                        <span className="nickname">
                            <LazyTypography width={160} fontSize="1.125rem">
                                {state.userInfo?.nickname}
                            </LazyTypography>
                        </span>
                        <span className="position">
                            <LazyTypography width={200} fontSize="0.875rem">
                                {state.userInfo?.position}
                            </LazyTypography>
                        </span>
                        <div className="counts">
                            <div className="likes">
                                <ThumbUpIcon />
                                <span className="count">{0}</span>
                            </div>
                            <div className="following">
                                <FollowOutIcon />
                                <span className="count">
                                    {(state.userInfo?.following || []).length}
                                </span>
                            </div>
                            <div className="followers">
                                <FollowInIcon />
                                <span className="count">
                                    {(state.userInfo?.followers || []).length}
                                </span>
                            </div>
                        </div>
                    </div>
                    {userInfo?.id !== uid &&
                        location.pathname?.split?.("/")?.[1] !== "publish" && (
                            <div className="buttons">
                                <CommonButton
                                    color={"primary"}
                                    className={`follow ${
                                        state.follow && "following"
                                    }`}
                                    type={state.follow ? "contrast" : "common"}
                                    onClick={
                                        state.follow
                                            ? onUnfollowHandler
                                            : onFollowHandler
                                    }
                                    loading={state.followLoading}
                                >
                                    {state.follow
                                        ? t("btn.unfollow")
                                        : t("btn.follow")}
                                </CommonButton>
                                <CommonButton className="message">
                                    {t("btn.message")}
                                </CommonButton>
                            </div>
                        )}
                </div>
                <div className="outlet">
                    <nav className="tabs">
                        <ul>
                            {__TABS__.map((tab) => (
                                <li
                                    key={tab.key}
                                    className={`${
                                        state.curTab === tab.key && "selected"
                                    }`}
                                    ref={tabRefs[tab.key]}
                                >
                                    <CommonButton
                                        type="text"
                                        color="black"
                                        onClick={() =>
                                            tab.onClick({
                                                uid,
                                                location,
                                                navigate,
                                            })
                                        }
                                    >
                                        {t(tab.i18nKey)}
                                    </CommonButton>
                                </li>
                            ))}
                            <div
                                ref={indicatorRef}
                                className="indicator"
                                style={{
                                    width: `${
                                        tabRefs?.[state.curTab]?.current
                                            ?.offsetWidth
                                    }px`,
                                    transform: `translateX(calc(${Object.values(
                                        tabRefs
                                    )
                                        .slice(
                                            0,
                                            Object.values(__TABS__).findIndex(
                                                (x) => x.key === state.curTab
                                            )
                                        )
                                        .reduce(
                                            (previousValue, currentValue) =>
                                                previousValue +
                                                    currentValue.current
                                                        ?.offsetWidth || 0,
                                            0
                                        )}px + ${
                                        2 *
                                        Object.values(__TABS__).findIndex(
                                            (x) => x.key === state.curTab
                                        )
                                    }em))`,
                                }}
                            />
                        </ul>
                    </nav>
                    <Outlet
                        context={{
                            userInfo: state.userInfo,
                        }}
                    />
                </div>
            </main>
            <BottomSheet
                open={state.openExpand}
                onDismiss={() => dispatch({ type: "CLOSE_EXPAND" })}
            >
                <div className="bottom-sheet expand">
                    {__EXPAND__.map((button) => (
                        <CommonButton
                            key={button.key}
                            type="contrast"
                            className={button.key}
                            icon={button.icon}
                            onClick={() => {
                                dispatch({
                                    type: "CLOSE_EXPAND",
                                });
                                button.onClick({
                                    modal,
                                    userInfo: state.userInfo,
                                });
                            }}
                        >
                            <span>{t(button.i18nKey)}</span>
                        </CommonButton>
                    ))}
                </div>
            </BottomSheet>
        </>
    );
};

export default UserDetail;

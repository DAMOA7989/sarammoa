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

const __TABS__ = [
    {
        key: "work",
        i18nKey: "tab.profile.work",
        onClick: ({ uid, navigate }) => {
            navigate.replace({
                pathname: `/user/${uid}`,
                mode: "sub",
            });
        },
    },
    {
        key: "history",
        i18nKey: "tab.profile.history",
        onClick: ({ uid, navigate }) => {
            navigate.replace({
                pathname: `/user/${uid}/history`,
                mode: "sub",
            });
        },
    },
    {
        key: "information",
        i18nKey: "tab.profile.information",
        onClick: ({ uid, navigate }) => {
            navigate.replace({
                pathname: `/user/${uid}/information`,
                mode: "sub",
            });
        },
    },
];

const UserDetail = () => {
    const { t } = useTranslation();
    const { uid } = useParams();
    const navigate = useNavigateContext();
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
            }
        },
        {
            userInfoLoading: false,
            userInfo: null,
            curTab: null,
        }
    );

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
                console.log("d userInfo", doc);
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
            indicatorRef.current.style.transition =
                "width 0.3s, transform 0.3s";
        }
    }, [indicatorRef.current]);

    return (
        <main className="pages-public-user-detail">
            <header className="header">
                <RippleEffect>
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
                            <span className="count">{0}</span>
                        </div>
                        <div className="followers">
                            <FollowInIcon />
                            <span className="count">{0}</span>
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    <CommonButton color="primary" className="follow">
                        {t("btn.follow")}
                    </CommonButton>
                    <CommonButton className="message">
                        {t("btn.message")}
                    </CommonButton>
                </div>
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
                                        tab.onClick({ uid, navigate })
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
                <Outlet />
            </div>
        </main>
    );
};

export default UserDetail;

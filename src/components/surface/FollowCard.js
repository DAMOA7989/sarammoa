import React from "react";
import { useTranslation } from "react-i18next";
import { _getUserInfo } from "utils/firebase/auth";
import { _follow, _unfollow } from "utils/firebase/user";
import LazyImage from "./LazyImage";
import LazyTypography from "./LazyTypography";
import RippleEffect from "./RippleEffect";
import { CircularProgress } from "@mui/material";
import { useNavigateContext } from "utils/navigate";
import { useModalContext } from "utils/modal";

const FollowCard = ({ className, pid, uid, search }) => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const modal = useModalContext();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "FOLLOW_PENDING":
                    return {
                        ...state,
                        isFollowLoading: true,
                    };
                case "FOLLOW_FULFILLED":
                    return {
                        ...state,
                        isFollowLoading: false,
                        isFollow: true,
                        isFollowInit: true,
                    };
                case "FOLLOW_REJECTED":
                    return {
                        ...state,
                        isFollowLoading: false,
                    };
                case "UNFOLLOW_PENDING":
                    return {
                        ...state,
                        isFollowLoading: true,
                    };
                case "UNFOLLOW_FULFILLED":
                    return {
                        ...state,
                        isFollowLoading: false,
                        isFollow: false,
                        isFollowInit: true,
                    };
                case "UNFOLLOW_REJECTED":
                    return {
                        ...state,
                        isFollowLoading: false,
                    };
                case "FETCH_USER_INFO_PENDING":
                    return {
                        ...state,
                        userInfoLoading: true,
                    };
                case "FETCH_USER_INFO_FULFILLED":
                    return {
                        ...state,
                        userInfoLoading: false,
                        userInfo: action.payload?.doc,
                    };
                case "FETCH_USER_INFO_REJECTED":
                    return {
                        ...state,
                        userInfoLoading: false,
                    };
                case "SHOW_CARD":
                    return {
                        ...state,
                        visibility: true,
                    };
                case "HIDE_CARD":
                    return {
                        ...state,
                        visibility: false,
                    };
            }
        },
        {
            userInfoLoading: false,
            userInfo: null,
            isFollow: false,
            visibility: true,
        }
    );

    React.useEffect(() => {
        if (!Boolean(uid)) {
            return;
        }

        dispatch({
            type: "FETCH_USER_INFO_PENDING",
        });
        _getUserInfo({ uid })
            .then((doc) => {
                dispatch({
                    type: "FETCH_USER_INFO_FULFILLED",
                    payload: {
                        doc,
                    },
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "FETCH_USER_INFO_REJECTED",
                });
            });
    }, [uid]);

    React.useEffect(() => {
        if (!state.userInfo) return;

        if (
            (state.userInfo?.followers || []).findIndex((x) => x.id === pid) >=
            0
        ) {
            dispatch({
                type: "FOLLOW_FULFILLED",
            });
        } else {
            dispatch({
                type: "UNFOLLOW_FULFILLED",
            });
        }
    }, [state.userInfo]);

    React.useEffect(() => {
        if (!state.userInfo) return;

        const _nickname = (state.userInfo?.nickname || "")
            .trim()
            .replaceAll(" ", "")
            .toLowerCase();
        const _search = (search || "").trim().replaceAll(" ", "").toLowerCase();

        if (_nickname.includes(_search)) {
            dispatch({
                type: "SHOW_CARD",
            });
        } else {
            dispatch({
                type: "HIDE_CARD",
            });
        }
    }, [state.userInfo, search]);

    if (!state.visibility) return null;
    return (
        <div className={`follow-card ${className}`}>
            <RippleEffect
                className="profile"
                onClick={() => {
                    modal.dismissModal();
                    navigate.push({
                        pathname: `/user/${uid}`,
                        mode: "sub",
                    });
                }}
            >
                <div className="profile-thumbnail">
                    <LazyImage
                        src={state.userInfo?.profileThumbnailUrl}
                        alt="profile thumbnail"
                    />
                </div>
                <div className="display">
                    <span className="nickname">
                        <LazyTypography width={120} fontSize={"0.875rem"}>
                            {state.userInfo?.nickname}
                        </LazyTypography>
                    </span>
                    <span className="position">
                        <LazyTypography width={160} fontSize={"0.75rem"}>
                            {state.userInfo?.position}
                        </LazyTypography>
                    </span>
                </div>
            </RippleEffect>
            {pid !== uid && state.isFollowInit ? (
                <RippleEffect
                    className={`follow-button ${
                        state.isFollow ? "following" : "unfollowing"
                    }`}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        if (state.isFollow) {
                            dispatch({
                                type: "UNFOLLOW_PENDING",
                            });

                            _unfollow({ from: pid, to: state.userInfo?.id })
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
                        } else {
                            dispatch({
                                type: "FOLLOW_PENDING",
                            });

                            _follow({ from: pid, to: state.userInfo?.id })
                                .then(() => {
                                    dispatch({
                                        type: "FOLLOW_FULFILLED",
                                    });
                                })
                                .catch((e) => {
                                    console.dir(e);
                                    dispatch({
                                        type: "FOLLOW_REJECTED",
                                    });
                                });
                        }
                    }}
                >
                    {state.isFollowLoading ? (
                        <CircularProgress
                            size={20}
                            color={state.isFollow ? "black" : "white"}
                        />
                    ) : state.isFollow ? (
                        t("btn.following")
                    ) : (
                        t("btn.follow")
                    )}
                </RippleEffect>
            ) : (
                <></>
            )}
        </div>
    );
};

export default FollowCard;

import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useNavigateContext } from "utils/navigate";
import {
    _getWritingDetail,
    _leaveComment,
    _delete,
    _switchPublishedField,
} from "utils/firebase/writing";
import { useStatusContext } from "utils/status";
import LazyImage from "components/surface/LazyImage";
import IdCard from "components/surface/IdCard";
import LazyTypography from "components/surface/LazyTypography";
import { ReactComponent as MoreIcon } from "assets/images/icons/writing/more.svg";
import { ReactComponent as ThumbsUpIcon } from "assets/images/icons/writing/thumbs_up.svg";
import { ReactComponent as EyeIcon } from "assets/images/icons/writing/eye.svg";
import CommonButton from "components/button/CommonButton";
import WoilonnInput from "components/input/WoilonnInput";
import { ReactComponent as SendIcon } from "assets/images/icons/writing/send.svg";
import { useAuthContext } from "utils/auth";
import RippleEffect from "components/surface/RippleEffect";
import { useOutsideClickListener } from "utils/hook";
import { BottomSheet } from "react-spring-bottom-sheet";
import CommentCard from "components/surface/CommentCard";

const __DROPDOWN_ITEMS__ = [
    {
        key: "edit",
        i18nKey: "text.dropdown.edit",
        onClick: ({ dispatch }) => {
            dispatch({
                type: "HIDE_MORE_DROPDOWN",
            });
        },
    },
    {
        key: "publish",
        i18nKey: "text.dropdown.publish",
        onClick: ({ uid, wid, dispatch, navigate, task }) => {
            task.run();
            _switchPublishedField({ uid, wid })
                .then(() => {
                    task.terminate();
                    dispatch({
                        type: "HIDE_MORE_DROPDOWN",
                    });
                    navigate.goBack();
                })
                .catch((e) => {
                    console.dir(e);
                    task.terminate();
                });
        },
    },
    {
        key: "unpublish",
        i18nKey: "text.dropdown.unpublish",
        onClick: ({ uid, wid, dispatch, navigate, task }) => {
            task.run();
            _switchPublishedField({ uid, wid })
                .then(() => {
                    task.terminate();
                    dispatch({
                        type: "HIDE_MORE_DROPDOWN",
                    });
                    navigate.goBack();
                })
                .catch((e) => {
                    console.dir(e);
                    task.terminate();
                });
        },
    },
    {
        key: "delete",
        i18nKey: "text.dropdown.delete",
        onClick: ({ uid, wid, dispatch, navigate, task }) => {
            task.run();
            _delete({ uid, wid })
                .then(() => {
                    task.terminate();
                    dispatch({
                        type: "HIDE_MORE_DROPDOWN",
                    });
                    navigate.goBack();
                })
                .catch((e) => {
                    console.dir(e);
                    task.terminate();
                });
        },
    },
];

const WritingDetail = () => {
    const { t } = useTranslation();
    const { wid } = useParams();
    const { userInfo } = useAuthContext();
    const navigate = useNavigateContext();
    const { task } = useStatusContext();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_WRITING_INFO_PENDING":
                    return {
                        ...state,
                        writingInfoLoading: true,
                        writingInfo: null,
                    };
                case "SET_WRITING_INFO_FULFILLED":
                    return {
                        ...state,
                        writingInfoLoading: false,
                        writingInfo: action.payload?.doc,
                    };
                case "SET_WRITING_INFO_REJECTED":
                    return {
                        ...state,
                        writingInfoLoading: false,
                        writingInfo: null,
                    };
                case "SUBMIT_COMMENT_PENDING":
                    return {
                        ...state,
                        commentLoading: true,
                    };
                case "SUBMIT_COMMENT_FULFILLED":
                    return {
                        ...state,
                        commentLoading: false,
                        comment: "",
                    };
                case "SUBMIT_COMMENT_REJECTED":
                    return {
                        ...state,
                        commentLoading: false,
                    };
                case "SET_COMMENT":
                    return {
                        ...state,
                        comment: action.payload?.value,
                    };
                case "SHOW_MORE_DROPDOWN":
                    return {
                        ...state,
                        showMoreDropdown: true,
                    };
                case "HIDE_MORE_DROPDOWN":
                    return {
                        ...state,
                        showMoreDropdown: false,
                    };
                case "OPEN_COMMENTS_BOTTOM_SHEET":
                    return {
                        ...state,
                        openCommentsBottomSheet: true,
                    };
                case "CLOSE_COMMENTS_BOTTOM_SHEET":
                    return {
                        ...state,
                        openCommentsBottomSheet: false,
                    };
            }
        },
        {
            writingInfoLoading: false,
            writingInfo: null,
            commentLoading: false,
            comment: "",
            showMoreDropdown: false,
            openCommentsBottomSheet: false,
        }
    );
    const moreRef = React.useRef(null);
    useOutsideClickListener(moreRef, (event) => {
        if (state.showMoreDropdown) {
            dispatch({
                type: "HIDE_MORE_DROPDOWN",
            });
        }
    });

    React.useLayoutEffect(() => {
        navigate.setLayout({
            screenTitle: "",
        });
    }, [wid]);

    React.useEffect(() => {
        if (!Boolean(wid)) return;

        dispatch({ type: "SET_WRITING_INFO_PENDING" });
        // task.run();
        _getWritingDetail({ wid })
            .then((doc) => {
                dispatch({
                    type: "SET_WRITING_INFO_FULFILLED",
                    payload: {
                        doc,
                    },
                });
                // task.terminate();
            })
            .catch((e) => {
                console.dir(e);
                dispatch({ type: "SET_WRITING_INFO_REJECTED" });
                // task.terminate();
            });
    }, [wid]);

    return (
        <>
            <main className="pages-protected-writing-detail">
                <header className="header">
                    <h3 className="title">
                        <LazyTypography width={160} fontSize={"1.5rem"}>
                            {state.writingInfo?.title}
                        </LazyTypography>
                    </h3>
                    <RippleEffect
                        onClick={() =>
                            navigate.push({
                                pathname: `/user/${state.writingInfo?.writer?.id}`,
                                mode: "sub",
                            })
                        }
                    >
                        <IdCard
                            className="writer-card"
                            size="regular"
                            userInfo={state.writingInfo?.writer}
                        />
                    </RippleEffect>
                    <div ref={moreRef} className="more">
                        <RippleEffect
                            onClick={() => {
                                if (!state.showMoreDropdown) {
                                    dispatch({
                                        type: "SHOW_MORE_DROPDOWN",
                                    });
                                } else {
                                    dispatch({
                                        type: "HIDE_MORE_DROPDOWN",
                                    });
                                }
                            }}
                        >
                            <MoreIcon />
                        </RippleEffect>
                        <div className="dropdown">
                            {state.showMoreDropdown && (
                                <ul>
                                    {__DROPDOWN_ITEMS__.map((item) => {
                                        if (
                                            item.key === "publish" &&
                                            state.writingInfo?.published ===
                                                true
                                        )
                                            return undefined;
                                        if (
                                            item.key === "unpublish" &&
                                            state.writingInfo?.published ===
                                                false
                                        )
                                            return undefined;

                                        return (
                                            <li key={item.key}>
                                                <RippleEffect>
                                                    <div
                                                        className="container"
                                                        onClick={() =>
                                                            item.onClick({
                                                                uid: userInfo?.id,
                                                                wid: state
                                                                    .writingInfo
                                                                    ?.id,
                                                                dispatch,
                                                                navigate,
                                                                task,
                                                            })
                                                        }
                                                    >
                                                        {t(item.i18nKey)}
                                                    </div>
                                                </RippleEffect>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </header>
                <div className="contents">
                    <ul>
                        {(state.writingInfo?.contents || []).length
                            ? (state.writingInfo?.contents || []).map(
                                  (content, idx) => {
                                      if (content.type === "photo") {
                                          return (
                                              <li key={idx}>
                                                  <div className="container image">
                                                      <LazyImage
                                                          src={content.value}
                                                          alt="content image"
                                                      />
                                                  </div>
                                              </li>
                                          );
                                      } else if (content.type === "text") {
                                          return (
                                              <li key={idx}>
                                                  <div className="container text">
                                                      <p>{content.value}</p>
                                                  </div>
                                              </li>
                                          );
                                      }
                                  }
                              )
                            : [1, 2, 3].map((x, idx) => (
                                  <li key={idx}>
                                      <div className="container image empty">
                                          <LazyImage
                                              position={"absolute"}
                                              src={null}
                                              alt="empty image"
                                          />
                                      </div>
                                  </li>
                              ))}
                    </ul>
                </div>
                <div className="info">
                    <h5 className="title">
                        <LazyTypography width={120} fontSize={"1rem"}>
                            {state.writingInfo?.title}
                        </LazyTypography>
                    </h5>
                    <div className="desc">
                        <div className="left">
                            <div className="likes">
                                <ThumbsUpIcon />
                                <span className="count">
                                    {(state.writingInfo?.likes || []).length}
                                </span>
                            </div>
                            <div className="views">
                                <EyeIcon />
                                <span className="count">
                                    {(state.writingInfo?.views || []).length}
                                </span>
                            </div>
                        </div>
                        <div className="right">
                            <span className="created-at">
                                {state.writingInfo?.createdAt
                                    .toDate()
                                    .toDateString()}
                            </span>
                        </div>
                    </div>
                    <div className="more">
                        <CommonButton
                            className="more-button"
                            type="text"
                            color="primary"
                        >
                            {t("btn.see_more_info")}
                        </CommonButton>
                    </div>
                </div>
                <div className="comment">
                    <ul>
                        {(state.writingInfo?.comments || [])
                            .slice(0, 3)
                            .map((comment, idx) => (
                                <li key={idx}>
                                    <div className="container">
                                        <div className="writer">
                                            <RippleEffect>
                                                <IdCard
                                                    size="small"
                                                    user={comment.writer}
                                                />
                                            </RippleEffect>
                                        </div>
                                        <div className="text">
                                            <div className="message">
                                                {comment.message}
                                            </div>
                                            <div className="created-at">
                                                {comment.createdAt
                                                    .toDate()
                                                    .toDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                    <div className="view-all-comments">
                        <CommonButton
                            className="view-all-comments-button"
                            type="text"
                            color="black"
                            onClick={() =>
                                dispatch({
                                    type: "OPEN_COMMENTS_BOTTOM_SHEET",
                                })
                            }
                        >
                            {`${t("button.view_all_comments")} (${
                                (state.writingInfo?.comments || []).length
                            })`}
                        </CommonButton>
                    </div>
                    <div className="send">
                        <WoilonnInput
                            placeholder={t("placeholder.comment")}
                            value={state.comment}
                            onChange={(event) => {
                                dispatch({
                                    type: "SET_COMMENT",
                                    payload: {
                                        value: event.target.value,
                                    },
                                });
                            }}
                            right={
                                <SendIcon
                                    onClick={() => {
                                        const message = state.comment;
                                        dispatch({
                                            type: "SUBMIT_COMMENT_PENDING",
                                        });
                                        _leaveComment({
                                            wid: state.writingInfo?.id,
                                            uid: userInfo?.id,
                                            message,
                                        })
                                            .then(() => {
                                                dispatch({
                                                    type: "SUBMIT_COMMENT_FULFILLED",
                                                });
                                            })
                                            .catch((e) => {
                                                console.dir(e);
                                                dispatch({
                                                    type: "SUBMIT_COMMENT_REJECTED",
                                                });
                                            });
                                    }}
                                />
                            }
                            loading={state.commentLoading}
                        />
                    </div>
                </div>
            </main>
            <BottomSheet
                open={state.openCommentsBottomSheet}
                onDismiss={() =>
                    dispatch({ type: "CLOSE_COMMENTS_BOTTOM_SHEET" })
                }
                snapPoints={({ minHeight, maxHeight }) => [
                    minHeight,
                    maxHeight * 0.8,
                ]}
                header={
                    <>
                        <h5>{t("header.bottom_sheet.comments")}</h5>
                    </>
                }
                footer={
                    <WoilonnInput
                        placeholder={t("placeholder.comment")}
                        value={state.comment}
                        onChange={(event) => {
                            dispatch({
                                type: "SET_COMMENT",
                                payload: {
                                    value: event.target.value,
                                },
                            });
                        }}
                        right={
                            <SendIcon
                                onClick={() => {
                                    const message = state.comment;
                                    dispatch({
                                        type: "SUBMIT_COMMENT_PENDING",
                                    });
                                    _leaveComment({
                                        wid: state.writingInfo?.id,
                                        uid: userInfo?.id,
                                        message,
                                    })
                                        .then(() => {
                                            dispatch({
                                                type: "SUBMIT_COMMENT_FULFILLED",
                                            });
                                        })
                                        .catch((e) => {
                                            console.dir(e);
                                            dispatch({
                                                type: "SUBMIT_COMMENT_REJECTED",
                                            });
                                        });
                                }}
                            />
                        }
                        loading={state.commentLoading}
                    />
                }
            >
                <div className="bottom-sheet comments">
                    <ul>
                        {(state.writingInfo?.comments || []).map(
                            (comment, idx) => (
                                <li key={idx}>
                                    <CommentCard
                                        writerId={comment.writer}
                                        message={comment.message}
                                        createdAt={comment.createdAt}
                                    />
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </BottomSheet>
        </>
    );
};

export default WritingDetail;

import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useNavigateContext } from "utils/navigate";
import { _getWritingDetail } from "utils/firebase/writing";
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

const WritingDetail = () => {
    const { t } = useTranslation();
    const { wid } = useParams();
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
                case "SET_COMMENT":
                    return {
                        ...state,
                        comment: action.payload?.value,
                    };
                case "CLEAR_COMMENT":
                    return {
                        ...state,
                        comment: "",
                    };
            }
        },
        {
            writingInfoLoading: false,
            writingInfo: null,
            comment: "",
        }
    );

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
                // task.finish();
            })
            .catch((e) => {
                console.dir(e);
                dispatch({ type: "SET_WRITING_INFO_REJECTED" });
                // task.finish();
            });
    }, [wid]);

    return (
        <main className="pages-protected-writing-detail">
            <header className="header">
                <h3 className="title">
                    <LazyTypography width={160} fontSize={"1.5rem"}>
                        {state.writingInfo?.title}
                    </LazyTypography>
                </h3>
                <IdCard
                    className="writer-card"
                    size="regular"
                    userInfo={state.writingInfo?.writer}
                />
                <div className="more">
                    <MoreIcon />
                </div>
            </header>
            <div className="contents">
                <ul>
                    {(state.writingInfo?.contents || []).map((content, idx) => {
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
                    })}
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
                                {state.writingInfo?.likes}
                            </span>
                        </div>
                        <div className="views">
                            <EyeIcon />
                            <span className="count">
                                {state.writingInfo?.views}
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
                    {(state.writingInfo?.comments || []).map((comment, idx) => (
                        <li key={idx}>
                            <div className="container">
                                <IdCard size="small" user={comment.writer} />
                                <div className="message">
                                    {comment.message +
                                        "blahblahblahblahbalbhalbhlahblahb"}
                                </div>
                                <div className="created-at">
                                    {comment.createdAt.toDate().toDateString()}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

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
                                    const comment = state.comment;
                                    dispatch({
                                        type: "CLEAR_COMMENT",
                                    });
                                }}
                            />
                        }
                    />
                </div>
            </div>
        </main>
    );
};

export default WritingDetail;

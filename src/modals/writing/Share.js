import React from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as CopyLinkIcon } from "assets/images/icons/share/copy_link.svg";
import { ReactComponent as EmailIcon } from "assets/images/icons/share/email.svg";
import { ReactComponent as KakaotalkIcon } from "assets/images/icons/share/kakaotalk.svg";
import { copyText } from "utils/string";
import { toast } from "react-toastify";
import { useModal } from "utils/modal";
import { _getWritingDetail } from "utils/firebase/writing";

const __AVAILABLE_ITEMS__ = [
    {
        key: "copy_link",
        i18nKey: "title.profile.share.copy_link",
        icon: <CopyLinkIcon />,
        onClick: ({ t, wid, writingInfo }) => {
            const url = `${process.env.REACT_APP_HOST_URL}/publish/writing/${wid}`;
            copyText({
                text: url,
            })
                .then(() => {
                    toast(t("toast.share.clipboard.write"));
                })
                .catch((e) => {
                    console.dir(e);
                });
        },
    },
    {
        key: "email",
        i18nKey: "title.profile.share.email",
        icon: <EmailIcon />,
        onClick: ({ t, wid, writingInfo }) => {
            const url = `${process.env.REACT_APP_HOST_URL}/publish/writing/${wid}`;
            window.location.href = `mailto:?subject=${
                writingInfo?.title
            }&body=${t("text.writing.share.email", {
                url,
            })}`;
        },
    },
    {
        key: "kakaotalk",
        i18nKey: "title.profile.share.kakaotalk",
        icon: <KakaotalkIcon />,
        onClick: ({ t, wid }) => {
            const url = `${process.env.REACT_APP_HOST_URL}/publish/writing/${wid}`;
            const kakao = window.Kakao;

            if (!kakao.isInitialized()) {
                return;
            }

            kakao.Share.sendDefault({
                objectType: "text",
                text: `${t("text.writing.share.email", {
                    url,
                })}`,
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            });
        },
    },
];

const Share = ({ modalId, wid, writingInfo }) => {
    const { t } = useTranslation();
    const modal = useModal(modalId);
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "GET_WRITING_INFO_PENDING":
                    return {
                        ...state,
                        writingInfoLoading: true,
                    };
                case "GET_WRITING_INFO_FULFILLED":
                    return {
                        ...state,
                        writingInfoLoading: false,
                        writingInfo: action.payload?.doc,
                    };
                case "GET_WRITING_INFO_REJECTED":
                    return {
                        ...state,
                        writingInfoLoading: false,
                    };
            }
        },
        {
            writingInfoLoading: false,
            writingInfo: null,
        }
    );

    React.useEffect(() => {
        if (!writingInfo) {
            dispatch({
                type: "GET_WRITING_INFO_PENDING",
            });
            _getWritingDetail({ wid })
                .then((doc) => {
                    dispatch({
                        type: "GET_WRITING_INFO_FULFILLED",
                        payload: {
                            doc,
                        },
                    });
                })
                .catch((e) => {
                    console.dir(e);
                    dispatch({
                        type: "GET_WRITING_INFO_REJECTED",
                    });
                });
        } else {
            dispatch({
                type: "GET_WRITING_INFO_FULFILLED",
                payload: {
                    doc: writingInfo,
                },
            });
        }
    }, []);

    return (
        <main className="modals-profile-share">
            <div className="container">
                {__AVAILABLE_ITEMS__.map((item, idx) => (
                    <CommonButton
                        key={idx}
                        type="contrast"
                        color="dark_gray"
                        loading={state.writingInfoLoading}
                        onClick={() => {
                            modal.close();
                            item.onClick({
                                t,
                                wid,
                                writingInfo: state.writingInfo,
                            });
                        }}
                        icon={item.icon}
                    >
                        {t(item.i18nKey)}
                    </CommonButton>
                ))}
            </div>
        </main>
    );
};

export default Share;

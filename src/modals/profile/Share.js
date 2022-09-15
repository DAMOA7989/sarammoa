import React from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as CopyLinkIcon } from "assets/images/icons/share/copy_link.svg";
import { ReactComponent as EmailIcon } from "assets/images/icons/share/email.svg";
import { ReactComponent as KakaotalkIcon } from "assets/images/icons/share/kakaotalk.svg";
import { copyText } from "utils/string";
import { toast } from "react-toastify";
import { useModalContext } from "utils/modal";
import { useAuthContext } from "utils/auth";
import { CircularProgress } from "@mui/material";

const __AVAILABLE_ITEMS__ = [
    {
        key: "copy_link",
        i18nKey: "title.profile.share.copy_link",
        icon: <CopyLinkIcon />,
        onClick: ({ t, userInfo }) => {
            copyText({
                text: `${process.env.REACT_APP_HOST_URL}/${userInfo?.nickname}`,
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
        onClick: ({ t, userInfo }) => {
            window.location.href = `mailto:?subject=${
                userInfo.fullName
            }&body=${t("text.profile.share.email", {
                app_name: t("app_name"),
                user_name: userInfo?.fullname,
                profile_url:
                    process.env.REACT_APP_HOST_URL +
                    "/user/" +
                    userInfo.nickname,
            })}`;
        },
    },
    {
        key: "kakaotalk",
        i18nKey: "title.profile.share.kakaotalk",
        icon: <KakaotalkIcon />,
        onClick: ({ t, userInfo }) => {
            const kakao = window.Kakao;
            if (!kakao) return;

            if (!kakao.isInitialized()) {
                kakao.init(process.env.REACT_APP_KAKAO_APP_JAVASCRIPT_KEY);
            }
            if (!kakao.isInitialized()) {
                return;
            }

            kakao.Share.sendDefault({
                objectType: "text",
                text: `${t("text.profile.share.email", {
                    app_name: t("app_name"),
                    user_name: userInfo?.fullname,
                    profile_url:
                        process.env.REACT_APP_HOST_URL +
                        "/user/" +
                        userInfo.nickname,
                })}`,
                link: {
                    mobileWebUrl:
                        process.env.REACT_APP_HOST_URL +
                        "/user/" +
                        userInfo.nickname,
                    webUrl:
                        process.env.REACT_APP_HOST_URL +
                        "/user/" +
                        userInfo.nickname,
                },
            });
        },
    },
];

const Share = ({}) => {
    const { t } = useTranslation();
    const { dismissModal } = useModalContext();
    const { userInfo } = useAuthContext();
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true);
        const script = window.document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.async = true;
        window.document.body.appendChild(script);

        script.onload = () => {
            setIsLoading(false);
        };
        return () => window.document.body.removeChild(script);
    }, []);

    return (
        <main className="modals-profile-share">
            <div className="container">
                {__AVAILABLE_ITEMS__.map((item) => (
                    <CommonButton
                        type="contrast"
                        color="dark_gray"
                        loading={false}
                        onClick={() => {
                            dismissModal();
                            item.onClick({ t, userInfo });
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

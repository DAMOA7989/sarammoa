import React from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as CopyLinkIcon } from "assets/images/icons/share/copy_link.svg";
import { ReactComponent as EmailIcon } from "assets/images/icons/share/email.svg";
import { ReactComponent as KakaotalkIcon } from "assets/images/icons/share/kakaotalk.svg";
import { copyText } from "utils/string";
import { toast } from "react-toastify";
import { useModal } from "utils/modal";
import { useAuthContext } from "utils/auth";

const __AVAILABLE_ITEMS__ = [
    {
        key: "copy_link",
        i18nKey: "title.profile.share.copy_link",
        icon: <CopyLinkIcon />,
        onClick: ({ t, userInfo }) => {
            const url = `${process.env.REACT_APP_HOST_URL}/publish/user/${userInfo.id}`;
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
        onClick: ({ t, userInfo }) => {
            const url = `${process.env.REACT_APP_HOST_URL}/publish/user/${userInfo.id}`;
            window.location.href = `mailto:?subject=${
                userInfo.fullName
            }&body=${t("text.profile.share.email", {
                app_name: t("app_name"),
                user_name: userInfo?.fullname,
                profile_url: url,
            })}`;
        },
    },
    {
        key: "kakaotalk",
        i18nKey: "title.profile.share.kakaotalk",
        icon: <KakaotalkIcon />,
        onClick: ({ t, userInfo }) => {
            const url = `${process.env.REACT_APP_HOST_URL}/publish/user/${userInfo.id}`;
            const kakao = window.Kakao;

            if (!kakao.isInitialized()) {
                return;
            }

            kakao.Share.sendDefault({
                objectType: "text",
                text: `${t("text.profile.share.email", {
                    app_name: t("app_name"),
                    user_name: userInfo?.fullname,
                    profile_url: url,
                })}`,
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            });
        },
    },
];

const Share = ({ modalId, userInfo: _userInfo }) => {
    const { t } = useTranslation();
    const modal = useModal(modalId);
    const { userInfo } = useAuthContext();
    const [userDetailInfo, setUserDetailInfo] = React.useState(null);

    React.useEffect(() => {
        if (_userInfo && Object.keys(_userInfo).length > 0) {
            setUserDetailInfo(_userInfo);
        } else {
            setUserDetailInfo(userInfo);
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
                        loading={false}
                        onClick={() => {
                            modal.close();
                            item.onClick({ t, userInfo: userDetailInfo });
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

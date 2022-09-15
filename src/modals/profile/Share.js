import React from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as CopyLinkIcon } from "assets/images/icons/share/copy_link.svg";
import { ReactComponent as EmailIcon } from "assets/images/icons/share/email.svg";
import { ReactComponent as KakaotalkIcon } from "assets/images/icons/share/kakaotalk.svg";
import { copyText } from "utils/string";
import { toast } from "react-toastify";
import { useModalContext } from "utils/modal";

const __AVAILABLE_ITEMS__ = [
    {
        key: "copy_link",
        i18nKey: "title.profile.share.copy_link",
        icon: <CopyLinkIcon />,
        onClick: ({ t }) => {
            copyText({
                text: `${process.env.REACT_APP_HOST_URL}/[userId]`,
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
        onClick: () => {},
    },
    {
        key: "kakaotalk",
        i18nKey: "title.profile.share.kakaotalk",
        icon: <KakaotalkIcon />,
        onClick: () => {},
    },
];

const Share = ({}) => {
    const { t } = useTranslation();
    const { dismissModal } = useModalContext();

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
                            item.onClick({ t });
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

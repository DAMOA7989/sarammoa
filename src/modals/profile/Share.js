import React from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as CopyLinkIcon } from "assets/images/icons/share/copy_link.svg";
import { ReactComponent as EmailIcon } from "assets/images/icons/share/email.svg";
import { ReactComponent as KakaotalkIcon } from "assets/images/icons/share/kakaotalk.svg";

const __AVAILABLE_ITEMS__ = [
    {
        key: "copy_link",
        i18nKey: "title.profile.share.copy_link",
        icon: <CopyLinkIcon />,
        onClick: () => {},
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

    return (
        <main className="modals-profile-share">
            <div className="container">
                {__AVAILABLE_ITEMS__.map((item) => (
                    <CommonButton
                        type="contrast"
                        color="dark_gray"
                        loading={false}
                        onClick={() => item.onClick()}
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

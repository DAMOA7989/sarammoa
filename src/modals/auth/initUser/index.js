import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { ReactComponent as ArrowBottomDoubleIcon } from "assets/images/icons/arrow_bottom_double.svg";
import CommonButton from "components/button/CommonButton";
import { useAuthContext } from "utils/auth";
import { useModal } from "utils/modal";

const Index = ({ modalId, _idx, screenIdx, setScreenIdx }) => {
    const { t } = useTranslation();
    const modal = useModal(modalId);
    const { signOut } = useAuthContext();

    return (
        <main className="modals-auth-init-user-index">
            <CommonButton
                className="sign-out-button"
                type="text"
                color="primary"
                onClick={() => signOut().then(() => modal.close())}
            >
                {t("text.setup.sign_out")}
            </CommonButton>
            <div className="container">
                <h1 className="title">
                    <Trans t={t} i18nKey="title.modal.init_user" />
                </h1>
                <div className="content">
                    <Trans
                        t={t}
                        i18nKey="text.modal.init_user"
                        components={{
                            alert: <span className="alert" />,
                        }}
                    />
                </div>
            </div>
            <ArrowBottomDoubleIcon
                className="arrow-bottom-double-icon"
                onClick={() => setScreenIdx(1)}
                style={{
                    display: _idx === screenIdx ? "block" : "none",
                }}
            />
        </main>
    );
};

export default Index;

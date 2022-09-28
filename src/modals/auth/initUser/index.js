import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { ReactComponent as ArrowBottomDoubleIcon } from "assets/images/icons/arrow_bottom_double.svg";

const Index = ({ screenIdx, setScreenIdx }) => {
    const { t } = useTranslation();

    return (
        <div className="modals-auth-init-user-index">
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
            />
        </div>
    );
};

export default Index;

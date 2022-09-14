import React from "react";
import { useTranslation } from "react-i18next";
import { useModalContext } from "utils/modal";

const ModalHeader = () => {
    const { t } = useTranslation();
    const { options, dismissModal } = useModalContext();

    return (
        <header className="modal-header">
            <div className="container">
                <div
                    className="dismiss-icon"
                    onClick={() => dismissModal()}
                ></div>
                {Boolean(options?.title) && (
                    <span className="title">{t(options.title)}</span>
                )}
            </div>
        </header>
    );
};

export default ModalHeader;

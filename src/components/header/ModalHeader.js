import React from "react";
import { useTranslation } from "react-i18next";
import { useModalContext } from "utils/modal";

const ModalHeader = ({ title }) => {
    const { t } = useTranslation();
    const { dismissModal } = useModalContext();

    return (
        <header className="modal-header">
            <div className="container">
                <div
                    className="dismiss-icon"
                    onClick={() => dismissModal()}
                ></div>
                {Boolean(title) && <span className="title">{t(title)}</span>}
            </div>
        </header>
    );
};

export default ModalHeader;

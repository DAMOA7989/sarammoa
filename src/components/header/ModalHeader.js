import React from "react";
import { useTranslation } from "react-i18next";
import { useModalContext } from "utils/modal";

const ModalHeader = () => {
    const { t } = useTranslation();
    const { dismissModal } = useModalContext();

    return (
        <header className="modal-header">
            <div className="container">
                <div
                    className="dismiss-icon"
                    onClick={() => dismissModal()}
                ></div>
            </div>
        </header>
    );
};

export default ModalHeader;

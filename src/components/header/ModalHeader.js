import React from "react";
import { useTranslation } from "react-i18next";
import RippleEffect from "components/surface/RippleEffect";
import { useModal } from "utils/modal";

const ModalHeader = ({ title, modalId }) => {
    const { t } = useTranslation();
    const modal = useModal(modalId);

    return (
        <header className="modal-header">
            <div className="container">
                <RippleEffect
                    className="dismiss-icon"
                    onClick={() => modal.close()}
                ></RippleEffect>
                {Boolean(title) && <span className="title">{t(title)}</span>}
            </div>
        </header>
    );
};

export default ModalHeader;

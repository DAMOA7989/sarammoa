import React from "react";
import reactDom from "react-dom";
import Modal from "./Modal";
import { useRecoilValue } from "recoil";
import { modalIdsAtom } from "recoil/modal";
import ErrorBoundary from "components/utils/ErrorBoundary";

const ModalFactory = () => {
    const modalIds = useRecoilValue(modalIdsAtom);

    if ((modalIds || []).length > 0) {
        return reactDom.createPortal(
            <>
                {(modalIds || []).map((modalId) => (
                    <ErrorBoundary key={modalId}>
                        <Modal modalId={modalId} />
                    </ErrorBoundary>
                ))}
            </>,
            document.getElementById("modals")
        );
    } else {
        return reactDom.createPortal(null, document.getElementById("modals"));
    }
};

export default ModalFactory;

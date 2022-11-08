import React from "react";
import reactDom from "react-dom";
import Modal from "./Modal";
import { useRecoilValue } from "recoil";
import { modalIdsAtom } from "recoil/modal";

const ModalFactory = () => {
    const modalIds = useRecoilValue(modalIdsAtom);

    if ((modalIds || []).length > 0) {
        return reactDom.createPortal(
            (modalIds || []).map((modalId) => (
                <Modal key={modalId} modalId={modalId} />
            )),
            document.getElementById("modals")
        );
    } else {
        return reactDom.createPortal(null, document.getElementById("modals"));
    }
};

export default ModalFactory;

import React from "react";
import reactDom from "react-dom";
import { useModalContext } from "utils/modal";
import ModalHeader from "components/header/ModalHeader";

const Modal = () => {
    const { path, params, options, dismissModal } = useModalContext();
    const [modalComponent, setModalComponent] = React.useState(null);
    const modalRef = React.useRef(null);

    React.useEffect(() => {
        if (!Boolean(path)) {
            setTimeout(() => {
                setModalComponent(null);
            }, 200);
            return;
        }
        setModalComponent(require(`modals/${path}.js`).default);
    }, [path]);

    React.useEffect(() => {
        const rootElem = window.document.getElementById("root");
        if (Boolean(path)) {
            rootElem.classList.add("hasModal");
        } else {
            rootElem.classList.remove("hasModal");
        }
    }, [path]);

    const el = document.getElementById("modal");
    if (!modalComponent) {
        return reactDom.createPortal(null, el);
    }
    return reactDom.createPortal(
        <div className={`modal-container`}>
            <div
                ref={modalRef}
                className={`modal ${Boolean(path) ? "display" : "dismiss"} ${
                    options?.hasButton ? "has-button" : ""
                }`}
            >
                <>
                    <ModalHeader />
                    {React.cloneElement(
                        modalComponent,
                        {
                            params,
                        },
                        null
                    )}
                </>
            </div>
        </div>,
        el
    );
};

export default Modal;

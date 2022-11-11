import React from "react";
import { useModal } from "utils/modal";
import { UNSAFE_NavigationContext } from "react-router-dom";
import ModalHeader from "components/header/ModalHeader";

const Modal = ({ modalId }) => {
    const { navigator } = React.useContext(UNSAFE_NavigationContext);
    const unblockRef = React.useRef(() => {});
    const {
        instance: { id: pathname, params, options, isOpen },
        close,
    } = useModal(modalId);
    const [display, setDisplay] = React.useState(false);
    const modalContainerRef = React.useRef(null);
    const modalRef = React.useRef(null);
    const timerRef = React.useRef(null);
    const ModalComponentRef = React.useRef(null);
    const optionsRef = React.useRef(options);
    const optionsTimerRef = React.useRef(null);

    React.useEffect(() => {
        const eventHandler = (event) => {
            if (!modalRef.current) return;
            if (!modalRef.current.contains(event.target)) {
                // close();
            }
        };

        window.document.addEventListener("click", eventHandler);

        return () => {
            window.document.removeEventListener("click", eventHandler);
        };
    }, []);

    React.useEffect(() => {
        clearTimeout(timerRef.current);
        timerRef.current = null;

        if (isOpen) {
            ModalComponentRef.current = require(`modals/${modalId}.js`).default;
            setDisplay(true);
        } else {
            timerRef.current = setTimeout(() => {
                setDisplay(false);
                ModalComponentRef.current = null;
            }, 200);
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (display) {
            unblockRef.current = navigator.block((tx) => {
                const autoUnblockingTx = {
                    ...tx,
                    retry: () => {
                        unblockRef.current();
                        tx.retry();
                    },
                };

                switch (tx.action) {
                    case "POP":
                        close();
                        break;
                    default:
                        autoUnblockingTx.retry();
                        break;
                }
            });
        } else {
            unblockRef.current?.();
            unblockRef.current = () => {};
        }
    }, [display]);

    React.useEffect(() => {
        if (!modalRef.current) return;

        modalRef.current.style.setProperty(
            "--modal-height",
            `${
                modalRef.current.offsetHeight -
                (modalRef.current.children?.[1]?.offsetHeight + 60)
            }px`
        );
    }, [modalRef.current, display]);

    React.useEffect(() => {
        clearTimeout(optionsTimerRef.current);
        optionsTimerRef.current = null;

        if (options) {
            optionsRef.current = options;
        } else {
            optionsTimerRef.current = setTimeout(() => {
                optionsRef.current = null;
            }, 200);
        }
    }, [options]);

    React.useEffect(() => {
        const rootElem = window.document.getElementById("root");
        if (isOpen) {
            rootElem.classList.add("hasModal");
        } else {
            rootElem.classList.remove("hasModal");
        }
    }, [isOpen]);

    if (!display) {
        return null;
    }
    return (
        <div ref={modalContainerRef} className={`modal-container`}>
            <div
                ref={modalRef}
                className={`modal ${isOpen ? "display" : "dismiss"} ${
                    optionsRef.current?.hasButton ? "has-button" : ""
                } ${optionsRef.current?.layout}`}
            >
                <>
                    {(typeof options?.goBackButton === "boolean" &&
                        !options?.goBackButton) || (
                        <ModalHeader
                            title={optionsRef.current?.title}
                            modalId={modalId}
                        />
                    )}
                    <ModalComponentRef.current modalId={modalId} {...params} />
                </>
            </div>
        </div>
    );
};

export default Modal;

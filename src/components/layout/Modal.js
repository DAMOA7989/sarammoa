import React from "react";
import reactDom from "react-dom";
import { useModalContext } from "utils/modal";
import ModalHeader from "components/header/ModalHeader";
import { useBlocker } from "utils/hook";
import { UNSAFE_NavigationContext } from "react-router-dom";

const Modal = () => {
    const { navigator } = React.useContext(UNSAFE_NavigationContext);
    const unblockRef = React.useRef(() => {});
    const { path, params, options, dismissModal } = useModalContext();
    const [display, setDisplay] = React.useState(Boolean(path));
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
                dismissModal();
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

        if (path) {
            setDisplay(true);
            ModalComponentRef.current = require(`modals/${path}.js`).default;
        } else {
            timerRef.current = setTimeout(() => {
                setDisplay(false);
                ModalComponentRef.current = null;
            }, 200);
        }
    }, [path]);

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
                        dismissModal();
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
        if (Boolean(path)) {
            rootElem.classList.add("hasModal");
        } else {
            rootElem.classList.remove("hasModal");
        }
    }, [path]);

    const el = document.getElementById("modal");
    if (!display) {
        return reactDom.createPortal(null, el);
    }
    // const ModalComponent =
    return reactDom.createPortal(
        <div ref={modalContainerRef} className={`modal-container`}>
            <div
                ref={modalRef}
                className={`modal ${Boolean(path) ? "display" : "dismiss"} ${
                    optionsRef.current?.hasButton ? "has-button" : ""
                } ${optionsRef.current?.layout}`}
            >
                <>
                    {(typeof options?.goBackButton === "boolean" &&
                        !options?.goBackButton) || (
                        <ModalHeader title={optionsRef.current?.title} />
                    )}
                    <ModalComponentRef.current {...params} />
                </>
            </div>
        </div>,
        el
    );
};

export default Modal;

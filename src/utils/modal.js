import React from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { modalSelectorFamily } from "recoil/modal";

export const useModal = (pathname = "") => {
    const [modal, setModal] = useRecoilState(modalSelectorFamily(pathname));
    const resetModal = useResetRecoilState(modalSelectorFamily(pathname));

    const open = React.useCallback(
        ({ params = {}, options = {} }) => {
            setModal((current) => ({
                ...current,
                isOpen: true,
                params,
                options,
            }));
        },
        [setModal]
    );

    const hide = React.useCallback(() => {
        setModal((current) => ({
            ...current,
            isOpen: false,
            params: {},
            options: {},
        }));
    }, [setModal]);

    const close = React.useCallback(() => {
        resetModal();
    }, [resetModal]);

    return { instance: modal, open, hide, close };
};

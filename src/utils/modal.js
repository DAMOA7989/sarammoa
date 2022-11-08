import React from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { modalSelectorFamily } from "recoil/modal";

export const useModal = (pathname = "") => {
    const [modal, setModal] = useRecoilState(modalSelectorFamily(pathname));
    const resetModal = useResetRecoilState(modalSelectorFamily(pathname));

    const open = ({ params = {}, options = {} }) => {
        setModal((current) => ({ ...current, isOpen: true, params, options }));
    };

    const hide = () => {
        setModal((current) => ({
            ...current,
            isOpen: false,
            params: {},
            options: {},
        }));
    };

    const close = () => {
        resetModal();
    };

    return { instance: modal, open, hide, close };
};

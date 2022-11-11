import { DefaultValue, selector, selectorFamily } from "recoil";
import { modalAtomFamily, modalIdsAtom } from "./atoms";

export const modalSelectorFamily = selectorFamily({
    key: "modalSelectorFamily",
    get:
        (modalId) =>
        ({ get }) =>
            get(modalAtomFamily(modalId)),
    set:
        (modalId) =>
        ({ set, reset }, modalInfo) => {
            if (modalInfo instanceof DefaultValue) {
                reset(modalAtomFamily(modalId));
                set(modalIdsAtom, (prevValue) =>
                    prevValue.filter((item) => item !== modalId)
                );
            } else {
                set(modalAtomFamily(modalId), modalInfo);
                set(modalIdsAtom, (prev) =>
                    Array.from(new Set([...prev, modalInfo.id]))
                );
            }
        },
});

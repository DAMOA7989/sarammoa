import { atom, atomFamily } from "recoil";

export const modalAtomFamily = atomFamily({
    key: "modalAtomFamily",
    default: (id) => ({
        id,
        isOpen: false,
        params: {},
        options: {},
    }),
});

export const modalIdsAtom = atom({
    key: "modalIdsAtom",
    default: [],
});

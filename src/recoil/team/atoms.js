import { atom, atomFamily } from "recoil";

export const teamMemberPositionsAtom = atom({
    key: "teamMemberPositionsAtom",
    default: [],
});

export const teamMemberPersonAtom = atomFamily({
    key: "teamMemberPersonAtom",
    default: (position) => ({
        key: position,
        person: 0,
    }),
});

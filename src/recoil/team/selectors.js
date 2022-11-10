import { DefaultValue, selector } from "recoil";
import { teamMemberPositionsAtom, teamMemberPersonAtom } from "./atoms";

export const teamMembersSelector = selector({
    key: "teamMembersSelector",
    get: ({ get }) => {
        const positions = get(teamMemberPositionsAtom);
        return positions.map((item) => {
            console.log(get(teamMemberPersonAtom(item)));
            return {
                position: item,
                person: get(teamMemberPersonAtom(item)).person,
            };
        });
    },
    set: ({ set, reset }, memberInfo) => {
        if (memberInfo.person === "0") {
            reset(teamMemberPersonAtom(memberInfo.position));
            set(teamMemberPositionsAtom, (prevValue) =>
                prevValue.filter((item) => item !== memberInfo.position)
            );
        } else {
            set(teamMemberPersonAtom(memberInfo.position), {
                position: memberInfo.position,
                person: memberInfo.person,
            });
            set(teamMemberPositionsAtom, (prev) =>
                Array.from(new Set([...prev, memberInfo.position]))
            );
        }
    },
});

import React from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { teamMembersSelector } from "recoil/team";

export const useTeam = () => {
    const [teamMembers, setTeamMembers] = useRecoilState(teamMembersSelector);

    const addPosition = React.useCallback(({ position, person }) => {
        setTeamMembers({ position, person });
    }, []);

    const getPositions = React.useCallback(() => {
        return teamMembers;
    }, [teamMembers]);

    const deletePosition = React.useCallback((position) => {
        setTeamMembers({ position, person: "0" });
    }, []);

    return { addPosition, getPositions, deletePosition };
};

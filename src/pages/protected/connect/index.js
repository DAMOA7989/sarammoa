import React from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as ArrowRightIcon } from "assets/images/icons/connect/arrow_right.svg";
import { _getUsers } from "utils/firebase/user";
import PersonCard from "components/surface/PersonCard";
import TeamCard from "components/surface/TeamCard";
import { ReactComponent as PlusIcon } from "assets/images/icons/connect/plus.svg";
import { useNavigateContext } from "utils/navigate";

const Connect = () => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "FETCH_TEAM_PENDING":
                    return {
                        ...state,
                        teamLoading: true,
                    };
                case "FETCH_TEAM_FULFILLED":
                    return {
                        ...state,
                        teamLoading: false,
                        team: action.payload?.docs,
                    };
                case "FETCH_TEAM_REJECTED":
                    return {
                        ...state,
                        teamLoading: false,
                    };
                case "FETCH_PEOPLE_PENDING":
                    return {
                        ...state,
                        peopleLoading: true,
                    };
                case "FETCH_PEOPLE_FULFILLED":
                    return {
                        ...state,
                        peopleLoading: false,
                        people: action.payload?.docs,
                    };
                case "FETCH_PEOPLE_REJECTED":
                    return {
                        ...state,
                        peopleLoading: false,
                    };
                case "FETCH_TEAMS_PENDING":
                    return {
                        ...state,
                        teamsLoading: true,
                    };
                case "FETCH_TEAMS_FULFILLED":
                    return {
                        ...state,
                        teamsLoading: false,
                        teams: action.payload?.docs,
                    };
                case "FETCH_TEAMS_REJECTED":
                    return {
                        ...state,
                        teamsLoading: false,
                    };
            }
        },
        {
            teamLoading: false,
            team: null,
            peopleLoading: false,
            people: [],
            teamsLoading: false,
            teams: [],
        }
    );

    React.useEffect(() => {
        dispatch({
            type: "FETCH_PEOPLE_PENDING",
        });
        _getUsers({
            limit: 10,
        })
            .then((docs) => {
                dispatch({
                    type: "FETCH_PEOPLE_FULFILLED",
                    payload: {
                        docs,
                    },
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "FETCH_PEOPLE_REJECTED",
                });
            });
    }, []);

    return (
        <main className="pages-protected-connect">
            <div className="team">
                <h1 className="title">{t("title.connect.joined_team")}</h1>
                <div className="content">
                    <CommonButton
                        className="create-team-btn"
                        color="primary"
                        onClick={() =>
                            navigate.push({
                                pathname: `/connect/create`,
                                mode: "sub",
                            })
                        }
                    >
                        <PlusIcon />
                        {t("btn.create_team")}
                    </CommonButton>
                </div>
            </div>
            <div className="people">
                <header>
                    <h1 className="title">{t("title.connect.people")}</h1>
                    <CommonButton
                        className="more-btn"
                        type="text"
                        color="primary"
                        onClick={() =>
                            navigate.push({
                                pathname: "/connect/people",
                                mode: "sub",
                            })
                        }
                    >
                        {t("btn.more")}
                        <ArrowRightIcon />
                    </CommonButton>
                </header>
                <div className="cards">
                    <ul>
                        {(state.people || []).map((person, idx) => (
                            <li key={person.id}>
                                <PersonCard uid={person.id} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="teams">
                <header>
                    <h1 className="title">{t("title.connect.teams")}</h1>
                    <CommonButton
                        className="more-btn"
                        type="text"
                        color="primary"
                        onClick={() =>
                            navigate.push({
                                pathname: "/connect/teams",
                                mode: "sub",
                            })
                        }
                    >
                        {t("btn.more")}
                        <ArrowRightIcon />
                    </CommonButton>
                </header>
            </div>
        </main>
    );
};

export default Connect;

import React from "react";
import SearchBar from "components/input/SearchBar";
import { useTranslation } from "react-i18next";
import { _getUserInfo } from "utils/firebase/auth";
import FollowCard from "components/surface/FollowCard";
import { useAuthContext } from "utils/auth";

const Following = ({ type, uid }) => {
    const { t } = useTranslation();
    const { userInfo } = useAuthContext();
    const [search, setSearch] = React.useState("");
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "FETCH_USER_INFO_PENDING":
                    return {
                        ...state,
                        userInfoLoading: true,
                    };
                case "FETCH_USER_INFO_FULFILLED":
                    return {
                        ...state,
                        userInfoLoading: false,
                        userInfo: action.payload?.doc,
                    };
                case "FETCH_USER_INFO_REJECTED":
                    return {
                        ...state,
                        userInfoLoading: false,
                        userInfo: null,
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
                        people: action.payload?.people,
                    };
                case "FETCH_PEOPLE_REJECTED":
                    return {
                        ...state,
                        peopleLoading: false,
                    };
            }
        },
        {
            userInfoLoading: false,
            userInfo: null,
            peopleLoading: false,
            people: [],
        }
    );

    React.useEffect(() => {
        if (!Boolean(uid)) return;

        dispatch({
            type: "FETCH_USER_INFO_PENDING",
        });
        _getUserInfo({ uid })
            .then((doc) => {
                dispatch({
                    type: "FETCH_USER_INFO_FULFILLED",
                    payload: {
                        doc,
                    },
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "FETCH_USER_INFO_REJECTED",
                });
            });
    }, [uid]);

    return (
        <main className="modals-profile-following">
            <div className="search">
                <SearchBar
                    placeholder={t("placeholder.search")}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>
            <div className="people following">
                <ul>
                    {type === "following" ? (
                        (state.userInfo?.following || []).map((person, idx) => (
                            <li key={idx}>
                                <FollowCard
                                    className={`person ${person.id}`}
                                    pid={userInfo?.id}
                                    uid={person.id}
                                    search={search}
                                />
                            </li>
                        ))
                    ) : type === "followers" ? (
                        (state.userInfo?.followers || []).map((person, idx) => (
                            <li key={idx}>
                                <FollowCard
                                    className={`person ${person.id}`}
                                    pid={userInfo?.id}
                                    uid={person.id}
                                    search={search}
                                />
                            </li>
                        ))
                    ) : (
                        <></>
                    )}
                </ul>
            </div>
        </main>
    );
};

export default Following;

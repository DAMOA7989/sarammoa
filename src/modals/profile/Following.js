import React from "react";
import SearchBar from "components/input/SearchBar";
import { useTranslation } from "react-i18next";
import { _getUserInfo } from "utils/firebase/auth";
import FollowCard from "components/surface/FollowCard";

const Following = ({ uid }) => {
    const { t } = useTranslation();
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
            }
        },
        {
            userInfoLoading: false,
            userInfo: null,
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
                    {(state.userInfo?.following || []).map((person, idx) => (
                        <li key={idx}>
                            <FollowCard
                                className={`person ${person.id}`}
                                pid={uid}
                                uid={person.id}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default Following;

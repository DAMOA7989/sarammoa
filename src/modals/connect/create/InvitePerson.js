import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as SelectedIcon } from "assets/images/icons/connect/selected.svg";
import { ReactComponent as UnselectedIcon } from "assets/images/icons/connect/unselected.svg";
import RippleEffect from "components/surface/RippleEffect";
import SearchBar from "components/input/SearchBar";
import IdCard from "components/surface/IdCard";
import { _getUsersWithSearch } from "utils/firebase/user";
import InfiniteScroll from "react-infinite-scroll-component";

const InvitePerson = () => {
    const { t } = useTranslation();

    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "CLEAR_PAGE":
                    return {
                        ...state,
                        page: 0,
                        people: [],
                    };
                case "INCREASE_PAGE":
                    return {
                        ...state,
                        page: state.page + 1,
                    };
                case "SET_PAGE":
                    return {
                        ...state,
                        page: action.payload?.page,
                    };
                case "ADD_PERSON":
                    return {
                        ...state,
                        selecteds: Array.from(
                            new Set([...state.selecteds, action.payload?.doc])
                        ),
                    };
                case "DELETE_PERSON":
                    const idx = state.selecteds.findIndex(
                        (x) => x.id === action.payload?.doc?.id
                    );

                    return {
                        ...state,
                        selecteds:
                            idx >= 0
                                ? [
                                      ...state.selecteds.slice(0, idx),
                                      ...state.selecteds.slice(
                                          idx + 1,
                                          state.selecteds.length
                                      ),
                                  ]
                                : state.selecteds,
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
                        people: action.payload.docs,
                    };
                case "FETCH_PEOPLE_REJECTED":
                    return {
                        ...state,
                        peopleLoading: false,
                    };
                case "TYPE_SEARCH":
                    return {
                        ...state,
                        search: action.payload?.value,
                    };
            }
        },
        {
            peopleLoading: false,
            people: [],
            selecteds: [],
            search: "",
            page: 0,
        }
    );

    React.useEffect(() => {
        if (!Boolean(state.search))
            return dispatch({
                type: "CLEAR_PAGE",
            });

        dispatch({
            type: "FETCH_PEOPLE_PENDING",
        });
        _getUsersWithSearch({
            search: state.search,
            limit: null,
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
    }, [state.search]);

    React.useEffect(() => {
        if (Boolean(state.search)) return;
        if (state.page === 0) {
            return dispatch({
                type: "INCREASE_PAGE",
            });
        }
        dispatch({
            type: "FETCH_PEOPLE_PENDING",
        });

        _getUsersWithSearch({
            lastDocSnapshot:
                state.page === 1
                    ? null
                    : state.people?.[state.people.length - 1]?.docSnapshot,
            limit: 5,
        })
            .then((docs) => {
                dispatch({
                    type: "FETCH_PEOPLE_FULFILLED",
                    payload: {
                        docs: [...state.people, ...docs],
                    },
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "FETCH_PEOPLE_REJECTED",
                });
            });
    }, [state.page]);

    const addPerson = (person) => {
        if (isSelected(person.id)) {
            dispatch({
                type: "DELETE_PERSON",
                payload: {
                    doc: person,
                },
            });
        } else {
            dispatch({
                type: "ADD_PERSON",
                payload: {
                    doc: person,
                },
            });
        }
    };

    const isSelected = React.useCallback(
        (uid) => {
            const idx = state.selecteds.findIndex((x) => x.id === uid);
            if (idx >= 0) return true;
            return false;
        },
        [state.selecteds]
    );

    console.log("d page", state.page);

    return (
        <main className="modals-connect-create-invite-person">
            <>
                <div className="search">
                    <SearchBar
                        placeholder={t("placeholder.search")}
                        value={state.search}
                        onChange={(event) =>
                            dispatch({
                                type: "TYPE_SEARCH",
                                payload: {
                                    value: event.target.value,
                                },
                            })
                        }
                    />
                </div>
                <div className="people">
                    <InfiniteScroll
                        dataLength={state.people.length}
                        next={
                            () => console.log("d next")
                            // dispatch({
                            //     type: "INCREASE_PAGE",
                            // })
                        }
                        hasMore={true}
                        loader={<h4>Loading...</h4>}
                        endMessage={
                            <p style={{ textAlign: "center" }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                    >
                        <ul>
                            {state.people.map((person) => (
                                <li key={person.id}>
                                    <RippleEffect
                                        className="container"
                                        onClick={() => addPerson(person)}
                                    >
                                        <IdCard userInfo={person} />
                                        <div className="select">
                                            {isSelected(person.id) ? (
                                                <SelectedIcon />
                                            ) : (
                                                <UnselectedIcon />
                                            )}
                                        </div>
                                    </RippleEffect>
                                </li>
                            ))}
                        </ul>
                    </InfiniteScroll>
                </div>
            </>
        </main>
    );
};

export default InvitePerson;

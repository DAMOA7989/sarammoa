import React from "react";
import { useTranslation } from "react-i18next";
import StoryCard from "components/surface/StoryCard";
import NewsfeedCard from "components/surface/NewsfeedCard";
import { _getWritings } from "utils/firebase/writing";
import { useAuthContext } from "utils/auth";

const __STORIES__ = [
    {
        key: "",
        writer: {
            nickname: "dusadusadusadusa",
            profileThumbnailUrl:
                "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/75PaGQeeXzM5Jzc2bThrDnRMyWL2%2FprofileThumbnail?alt=media&token=81ca7d39-3efd-41ac-bc9b-abf4222397fa",
        },
    },
    {
        key: "",
        writer: {
            nickname: "dusa",
            profileThumbnailUrl:
                "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/HRJzhWfzdgUzxYDJGx4FRpOiQgg2%2FprofileThumbnail?alt=media&token=b6cd6b98-2c64-46c8-9e78-e4bb3bc3a7d2",
        },
    },
    {
        key: "",
        writer: {
            nickname: "dusa",
            profileThumbnailUrl:
                "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/UZ3sfgQ7nyUIo2EEwKHcZqKHQTm1%2FprofileThumbnail?alt=media&token=73caad31-2665-4920-a3c2-d6b57adeac64",
        },
    },
    {
        key: "",
        writer: {
            nickname: "dumsa",
            profileThumbnailUrl:
                "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/YvOiTh3xovZ7IkB9Jx2B8GvZenX2%2FprofileThumbnail?alt=media&token=19d1eca9-dfdb-4e07-a5c3-57a2535d19c1",
        },
    },
    {
        key: "",
        writer: {
            nickname: "dusa",
            profileThumbnailUrl:
                "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/75PaGQeeXzM5Jzc2bThrDnRMyWL2%2FprofileThumbnail?alt=media&token=81ca7d39-3efd-41ac-bc9b-abf4222397fa",
        },
    },
];

const __CARDS__ = [
    {
        key: "",
        titleImageSrc:
            "https://blog.kakaocdn.net/dn/bdaEMH/btq8pNTyCoH/QCKnS2csxjzOrizEPyuiL1/img.jpg",
        title: "sarammoa",
        writer: {
            profileThumbnailUrl:
                "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/75PaGQeeXzM5Jzc2bThrDnRMyWL2%2FprofileThumbnail?alt=media&token=81ca7d39-3efd-41ac-bc9b-abf4222397fa",
            nickname: "dusa",
        },
    },
    {
        key: "",
        titleImageSrc:
            "https://blog.kakaocdn.net/dn/bdaEMH/btq8pNTyCoH/QCKnS2csxjzOrizEPyuiL1/img.jpg",
        title: "sarammoa",
        writer: {
            profileThumbnailUrl:
                "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/75PaGQeeXzM5Jzc2bThrDnRMyWL2%2FprofileThumbnail?alt=media&token=81ca7d39-3efd-41ac-bc9b-abf4222397fa",

            nickname: "dusa",
        },
    },
    {
        key: "",
        titleImageSrc:
            "https://blog.kakaocdn.net/dn/bdaEMH/btq8pNTyCoH/QCKnS2csxjzOrizEPyuiL1/img.jpg",
        title: "sarammoa",
        writer: {
            profileThumbnailUrl:
                "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/75PaGQeeXzM5Jzc2bThrDnRMyWL2%2FprofileThumbnail?alt=media&token=81ca7d39-3efd-41ac-bc9b-abf4222397fa",

            nickname: "dusa",
        },
    },
];

const NewsFeed = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuthContext();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "INCREASE_PAGE":
                    return {
                        ...state,
                        page: state.page + 1,
                    };
                case "DECREASE_PAGE":
                    return {
                        ...state,
                        page: state.page - 1,
                    };
                case "INIT_WRITINGS":
                    return {
                        ...state,
                        page: 0,
                        writings: [],
                    };
                case "CLEAR_WRITINGS":
                    return {
                        ...state,
                        page: -1,
                        writings: [],
                    };
                case "PUSH_WRITINGS_PENDING":
                    return {
                        ...state,
                        writingsLoading: true,
                    };
                case "PUSH_WRITINGS_FULFILLED":
                    const prevWritings = state.writings;
                    const newWritings = action.payload?.docs || [];

                    return {
                        ...state,
                        writingsLoading: false,
                        writings: [...prevWritings, ...newWritings],
                    };
                case "PUSH_WRITINGS_REJECTED":
                    return {
                        ...state,
                        writingsLoading: false,
                    };
            }
        },
        {
            page: -1,
            writingsLoading: false,
            writings: [],
        }
    );
    const prevPage = React.useRef(-1);

    React.useEffect(() => {
        if (state.page < 0) {
            dispatch({
                type: "INIT_WRITINGS",
            });
        } else {
            dispatch({
                type: "PUSH_WRITINGS_PENDING",
            });
            _getWritings({
                uid: userInfo?.id,
                lastVisible:
                    state.writings?.[(state.writings?.length || []) - 1],
            })
                .then(({ docs }) => {
                    dispatch({
                        type: "PUSH_WRITINGS_FULFILLED",
                        payload: {
                            docs,
                        },
                    });
                })
                .catch((e) => {
                    console.dir(e);
                    dispatch({
                        type: "PUSH_WRITINGS_REJECTED",
                    });
                });
        }

        prevPage.current = state.page;
    }, [userInfo, state.page]);

    const fetchWritings = () => {
        const lastVisible =
            state.writings && state.writings[state.writings.length - 1];

        dispatch({
            type: "PUSH_WRITINGS_PENDING",
        });
        _getWritings({ uid: userInfo?.id, lastVisible, limit: 3 })
            .then(({ docs }) => {
                dispatch({
                    type: "PUSH_WRITINGS_FULFILLED",
                    payload: {
                        docs,
                    },
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "PUSH_WRITINGS_REJECTED",
                });
            });
    };

    console.log("d writings", state.writings);

    return (
        <main className="pages-public-newsfeed">
            <div className="container">
                <div className="stories">
                    <ul>
                        <li className="add">
                            <StoryCard className="add" type="add" />
                        </li>
                        {(__STORIES__ || []).map((story, idx) => (
                            <li key={idx} className="normal">
                                <StoryCard
                                    className="normal"
                                    writer={story.writer}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="cards">
                    <ul>
                        {(state.writings || []).map((card, idx) => (
                            <li key={idx}>
                                <NewsfeedCard
                                    cover={card.cover}
                                    title={card.title}
                                    writer={card.writer}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
};

export default NewsFeed;

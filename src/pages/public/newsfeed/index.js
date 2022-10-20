import React from "react";
import { useTranslation } from "react-i18next";
import StoryCard from "components/surface/StoryCard";
import NewsfeedCard from "components/surface/NewsfeedCard";
import { _getWritings } from "utils/firebase/writing";
import { useAuthContext } from "utils/auth";
import { useNavigateContext } from "utils/navigate";
import { useStatusContext } from "utils/status";

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

const NewsFeed = () => {
    const { t } = useTranslation();
    const { user, userInfo } = useAuthContext();
    const navigate = useNavigateContext();
    const { task } = useStatusContext();
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
                case "CLEAR_WRITINGS":
                    return {
                        ...state,
                        page: 0,
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
    const prevUserInfo = React.useRef({ status: "idle" });

    React.useEffect(() => {
        if (userInfo?.status === "idle" || userInfo?.status === "pending") {
            dispatch({
                type: "CLEAR_WRITINGS",
            });
            return;
        }

        if (userInfo?.status === "rejected") {
            fetchWritings(null);
        } else if (userInfo?.status === "fulfilled") {
            fetchWritings(userInfo?.id);
        }
    }, [userInfo?.status, state.page]);

    const fetchWritings = (uid) => {
        if (typeof uid === "undefined") return;
        const lastVisible =
            state.writings && state.writings[state.writings.length - 1];

        dispatch({
            type: "PUSH_WRITINGS_PENDING",
        });
        _getWritings({ uid, lastVisible })
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
                                    onClick={() => {
                                        if (userInfo?.id) {
                                            navigate.push({
                                                pathname: `/writing/${card.id}`,
                                                mode: "sub",
                                            });
                                        } else {
                                            alert("Please login");
                                        }
                                    }}
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

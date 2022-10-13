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
            }
        },
        {
            page: -1,
            writings: [],
        }
    );
    const prevPage = React.useRef(-1);

    React.useEffect(() => {
        if (userInfo?.id) {
            if (state.page < 0) {
                dispatch({
                    type: "INIT_WRITINGS",
                });
            } else {
                fetchWritings();
            }
            prevPage.current = state.page;
        }
    }, [userInfo, state.page]);

    const fetchWritings = () => {
        const lastVisible =
            state.writings && state.writings[state.writings.length - 1];

        _getWritings({ uid: userInfo?.id, lastVisible, limit: 3 })
            .then(({ docs }) => {
                console.log("d docs", docs);
            })
            .catch((e) => {
                console.dir(e);
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
                        {(__CARDS__ || []).map((card, idx) => (
                            <li key={idx}>
                                <NewsfeedCard
                                    titleImageSrc={card.titleImageSrc}
                                    title={card.title}
                                    content={card.content}
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

import React from "react";
import { useTranslation } from "react-i18next";
import StoryCard from "components/surface/StoryCard";
import NewsfeedCard from "components/surface/NewsfeedCard";

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
        content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
        content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
        content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        writer: {
            profileThumbnailUrl:
                "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/75PaGQeeXzM5Jzc2bThrDnRMyWL2%2FprofileThumbnail?alt=media&token=81ca7d39-3efd-41ac-bc9b-abf4222397fa",

            nickname: "dusa",
        },
    },
];

const NewsFeed = () => {
    const { t } = useTranslation();

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

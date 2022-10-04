import React from "react";
import { useTranslation } from "react-i18next";
import StoryCard from "components/surface/StoryCard";

const __STORIES__ = [
    {
        key: "",
        writer: {
            nickname: "dusa",
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
        title: "",
        writer: {
            profileThumbnailUrl: "",
            nickname: "",
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
                <div className="cards">cards</div>
            </div>
        </main>
    );
};

export default NewsFeed;

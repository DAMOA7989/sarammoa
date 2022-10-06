import React from "react";
import { useTranslation } from "react-i18next";
import ProfileHistoryCard from "components/surface/ProfileHistoryCard";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as PlusIcon } from "assets/images/icons/profile/plus.svg";
import { useNavigateContext } from "utils/navigate";

const __WRITES__ = [
    {
        id: 1,
        titleImageUrl:
            "https://mir-s3-cdn-cf.behance.net/project_modules/1400/d5dd1f150493725.62fb71a11dbf8.jpg",
        title: "Sarammoa",
    },
    {
        id: 2,
        titleImageUrl:
            "https://ditoday.com/wp-content/uploads/2022/05/%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%9E%90%EB%A3%8C-%EB%93%9C%EB%9E%98%EA%B7%B8%EC%95%A4%EB%93%9C%EB%A1%AD%EC%9C%BC%EB%A1%9C-%EC%95%B1%EA%B3%BC-%EC%9B%B9%EC%97%90-%EB%93%A4%EC%96%B4%EA%B0%80%EB%8A%94-%EB%AA%A8%EC%85%98%EC%9D%84-%EC%82%BD%EC%9E%85%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8B%A4-648x324.png",
        title: "Sarammoa",
    },
    {
        id: 3,
        titleImageUrl:
            "https://i.pinimg.com/736x/9f/ca/02/9fca02144c2fb125a322a61f9d2c25d2.jpg",
        title: "Sarammoa",
    },
    {
        id: 4,
        titleImageUrl:
            "https://mir-s3-cdn-cf.behance.net/project_modules/1400/d5dd1f150493725.62fb71a11dbf8.jpg",
        title: "Sarammoa",
    },
];

const History = () => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();

    return (
        <div className="pages-protected-profile-history">
            <section className="top">
                <div className="writes">
                    <ul>
                        {(__WRITES__ || []).map((write, idx) => (
                            <li key={idx}>
                                <ProfileHistoryCard
                                    titleImageUrl={write.titleImageUrl}
                                    title={write.title}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            <section className="bottom">
                <CommonButton
                    className="add"
                    color="primary"
                    onClick={() => {
                        navigate.push({
                            pathname: "/profile/history/add",
                            mode: "sub",
                            screenTitle: "title.profile.history.add",
                        });
                    }}
                >
                    <PlusIcon />
                </CommonButton>
            </section>
        </div>
    );
};

export default React.memo(History);

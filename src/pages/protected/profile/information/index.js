import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as GpsIcon } from "assets/images/icons/profile/gps.svg";

const __BOXES__ = [
    {
        key: "views",
        i18nKey: "title.profile.information.views",
        count: 0,
        onClick: () => {},
    },
    {
        key: "appereciations",
        i18nKey: "title.profile.information.appreciations",
        count: 5,
        onClick: () => {},
    },
    {
        key: "followers",
        i18nKey: "title.profile.information.followers",
        count: 132,
        onClick: () => {},
    },
    {
        key: "followings",
        i18nKey: "title.profile.information.followings",
        count: 254,
        onClick: () => {},
    },
];

const Information = () => {
    const { t } = useTranslation();

    return (
        <div className="pages-protected-profile-information">
            <section className="top">
                <div className="boxes">
                    <ul>
                        {(__BOXES__ || []).map((box, idx) => (
                            <li key={idx}>
                                <div className="container">
                                    <span className="count">{box.count}</span>
                                    <span className="label">
                                        {t(box.i18nKey)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="location">
                    <h3 className="title">
                        {t("title.profile.information.location")}
                    </h3>
                    <div className="position">
                        <GpsIcon />
                        <span className="country">{"Republic of Korea"}</span>
                    </div>
                </div>
            </section>
            <section className="bottom">
                <div className="created-at">{`Members since apr 17, 2022`}</div>
            </section>
        </div>
    );
};

export default React.memo(Information);

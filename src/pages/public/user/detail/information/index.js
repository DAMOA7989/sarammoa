import React from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { ReactComponent as GpsIcon } from "assets/images/icons/profile/gps.svg";
import RippleEffect from "components/surface/RippleEffect";

const __BOXES__ = [
    {
        key: "views",
        i18nKey: "title.profile.information.views",
        count: ({ userInfo }) => 0,
        onClick: () => {},
    },
    {
        key: "appereciations",
        i18nKey: "title.profile.information.appreciations",
        count: ({ userInfo }) => 5,
        onClick: () => {},
    },
    {
        key: "followers",
        i18nKey: "title.profile.information.followers",
        count: ({ userInfo }) => (userInfo?.followers || []).length,
        onClick: () => {},
    },
    {
        key: "followings",
        i18nKey: "title.profile.information.followings",
        count: ({ userInfo }) => (userInfo?.following || []).length,
        onClick: () => {},
    },
];

const UserDetailInformation = () => {
    const { t } = useTranslation();
    const { userInfo } = useOutletContext();

    return (
        <>
            <div className="user-detail-information">
                <div className="top">
                    <div className="boxes">
                        <ul>
                            {__BOXES__.map((box, idx) => (
                                <li key={idx}>
                                    <RippleEffect onClick={() => box.onClick()}>
                                        <div className="container">
                                            <span className="count">
                                                {box.count({ userInfo })}
                                            </span>
                                            <span className="label">
                                                {t(box.i18nKey)}
                                            </span>
                                        </div>
                                    </RippleEffect>
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
                            <span className="country">
                                {"Republic of Korea"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="created-at">
                        {`Members since ${userInfo?.createdAt
                            ?.toDate()
                            ?.toDateString()}`}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetailInformation;

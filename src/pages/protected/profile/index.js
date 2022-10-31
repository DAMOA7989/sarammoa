import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigateContext } from "utils/navigate";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useAuthContext } from "utils/auth";
import CommonButton from "components/button/CommonButton";
import { useModalContext } from "utils/modal";
import { ReactComponent as EditIcon } from "assets/images/icons/profile/edit.svg";
import { ReactComponent as ShareIcon } from "assets/images/icons/profile/share.svg";
import RippleEffect from "components/surface/RippleEffect";
import LazyImage from "components/surface/LazyImage";
import LazyTypography from "components/surface/LazyTypography";
import { _getFollowInfos } from "utils/firebase/user";
import { _countTotalLikes, _countTotalViews } from "utils/firebase/writing";
import { ReactComponent as ThumbUpIcon } from "assets/images/icons/thumb_up.svg";
import { ReactComponent as FollowInIcon } from "assets/images/icons/follow_from.svg";
import { ReactComponent as FollowOutIcon } from "assets/images/icons/follow_to.svg";
import { ReactComponent as GearIcon } from "assets/images/icons/gear.svg";
import { ReactComponent as DotsVerticalIcon } from "assets/images/icons/dots_vertical.svg";

const __TABS__ = [
    {
        key: "work",
        i18nKey: "tab.profile.work",
        onClick: ({ navigate }) => {
            navigate.replace({
                pathname: "/profile",
                mode: "main",
            });
        },
    },
    {
        key: "history",
        i18nKey: "tab.profile.history",
        onClick: ({ navigate }) => {
            navigate.replace({
                pathname: `/profile/history`,
                mode: "main",
            });
        },
    },
    {
        key: "information",
        i18nKey: "tab.profile.information",
        onClick: ({ navigate }) => {
            navigate.replace({
                pathname: "/profile/information",
                mode: "main",
            });
        },
    },
];

const __EXPAND__ = [
    {
        key: "edit_profile",
        i18nKey: "text.profile.expand.edit_profile",
        icon: <EditIcon />,
        onClick: ({ navigate }) => {
            navigate.push({
                pathname: "/profile/edit",
                mode: "sub",
                screenTitle: "text.profile.expand.edit_profile",
            });
        },
    },
    {
        key: "share",
        i18nKey: "text.profile.expand.share",
        icon: <ShareIcon />,
        onClick: ({ modal }) => {
            modal.displayModal({
                pathname: "profile/Share",
                params: {},
                options: {
                    title: "title.profile.share",
                    layout: "responsive",
                },
            });
        },
    },
];

const Profile = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigateContext();
    const { userInfo: _userInfo } = useAuthContext();
    const [userInfo, setUserInfo] = React.useState(_userInfo);
    const modal = useModalContext();
    const [curTab, setCurTab] = React.useState(null);
    const [openExpand, setOpenExpand] = React.useState(false);
    const tabRefs = {
        work: React.useRef(null),
        history: React.useRef(null),
        information: React.useRef(null),
    };

    React.useEffect(() => {
        const tabs = __TABS__.map((x) => x.key);
        let _tab = tabs?.[0];
        tabs.forEach((tab) => {
            if (location.pathname.split("/").includes(tab)) {
                _tab = tab;
                return;
            }
        });
        return setCurTab(_tab);
    }, [location.pathname]);

    React.useEffect(() => {
        const data = _userInfo;
        if (_userInfo?.id) {
            _getFollowInfos({ uid: _userInfo?.id })
                .then((docs) => {
                    data.following = docs.following;
                    data.followers = docs.followers;
                })
                .catch((e) => {
                    console.dir(e);
                });
            _countTotalLikes({ uid: _userInfo?.id })
                .then((docs) => {
                    data.likes = docs;
                })
                .catch((e) => {
                    console.dir(e);
                });
            _countTotalViews({ uid: _userInfo?.id })
                .then((docs) => {
                    data.views = docs;
                })
                .catch((e) => {
                    console.dir(e);
                });
        }
        setUserInfo(data);
    }, [_userInfo]);

    return (
        <>
            <main className="pages-protected-profile">
                <div className="profile-wrap">
                    <header>
                        <RippleEffect
                            onClick={() => {
                                navigate.push({
                                    pathname: "/profile/setup",
                                    mode: "sub",
                                });
                            }}
                        >
                            <GearIcon />
                        </RippleEffect>
                        <RippleEffect
                            onClick={() => setOpenExpand(!openExpand)}
                        >
                            <DotsVerticalIcon />
                        </RippleEffect>
                    </header>
                    <div className="profile">
                        <div className="profile-container">
                            <div className="profile-thumbnail">
                                <LazyImage
                                    src={userInfo?.profileThumbnailUrl}
                                    alt="profile thumbnail"
                                />
                            </div>
                            <div className="profile-info">
                                <span className="nickname">
                                    <LazyTypography
                                        width={160}
                                        fontSize="1.125rem"
                                    >
                                        {userInfo?.nickname}
                                    </LazyTypography>
                                </span>
                                <span className="position">
                                    <LazyTypography
                                        width={200}
                                        fontSize="0.875rem"
                                    >
                                        {userInfo?.position}
                                    </LazyTypography>
                                </span>
                                <div className="counts">
                                    <div className="likes">
                                        <ThumbUpIcon />
                                        <span className="count">0</span>
                                    </div>
                                    <div className="following">
                                        <FollowOutIcon />
                                        <span className="count">
                                            {(userInfo?.following || []).length}
                                        </span>
                                    </div>
                                    <div className="followers">
                                        <FollowInIcon />
                                        <span className="count">
                                            {(userInfo?.followers || []).length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className="name-small">
                                {userInfo?.nickname || "loading"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="info">
                    <nav className="tabs">
                        <ul>
                            {__TABS__.map((tab) => (
                                <li
                                    key={tab.key}
                                    className={`${
                                        curTab === tab.key && "selected"
                                    }`}
                                    ref={tabRefs[tab.key]}
                                >
                                    <CommonButton
                                        type="text"
                                        color="black"
                                        onClick={() =>
                                            tab.onClick({ navigate })
                                        }
                                    >
                                        {t(tab.i18nKey)}
                                    </CommonButton>
                                </li>
                            ))}
                            <div
                                className="indicator"
                                style={{
                                    width: `${tabRefs?.[curTab]?.current?.offsetWidth}px`,
                                    transform: `translateX(calc(${Object.values(
                                        tabRefs
                                    )
                                        .slice(
                                            0,
                                            Object.values(__TABS__).findIndex(
                                                (x) => x.key === curTab
                                            )
                                        )
                                        .reduce(
                                            (previousValue, currentValue) =>
                                                previousValue +
                                                    currentValue.current
                                                        ?.offsetWidth || 0,
                                            0
                                        )}px + ${
                                        2 *
                                        Object.values(__TABS__).findIndex(
                                            (x) => x.key === curTab
                                        )
                                    }em))`,
                                }}
                            />
                        </ul>
                    </nav>
                    <Outlet context={{ userInfo }} />
                </div>
            </main>
            <BottomSheet
                open={openExpand}
                onDismiss={() => setOpenExpand(false)}
            >
                <div className="bottom-sheet expand">
                    {__EXPAND__.map((button) => (
                        <CommonButton
                            key={button.key}
                            type="contrast"
                            icon={button.icon}
                            className={button.key}
                            onClick={() => {
                                setOpenExpand(false);
                                button.onClick({ navigate, modal });
                            }}
                        >
                            <span>{t(button.i18nKey)}</span>
                        </CommonButton>
                    ))}
                </div>
            </BottomSheet>
        </>
    );
};

export default Profile;

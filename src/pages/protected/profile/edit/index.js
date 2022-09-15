import React from "react";
import WoilonnInput from "components/input/WoilonnInput";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useAuthContext } from "utils/auth";
import { _setUserInfo, _uploadProfileThumbnail } from "utils/firebase/auth";
import { useNavigateContext } from "utils/navigate";
import { ReactComponent as PhotoIcon } from "assets/images/icons/profile/edit/photo.svg";
import { ReactComponent as TrashIcon } from "assets/images/icons/profile/edit/trash.svg";

const __PROFILE_THUMBNAIL_BUTTONS__ = [
    {
        key: "upload",
        i18nKey: "btn.profile.edit.profile_thumbnail.upload",
        icon: <PhotoIcon />,
        onClick: ({ inputFileRef }) => {
            inputFileRef.current.click();
        },
    },
    {
        key: "delete",
        i18nKey: "btn.profile.edit.profile_thumbnail.delete",
        icon: <TrashIcon />,
        onClick: () => {},
    },
];

const Edit = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuthContext();
    const { goBack } = useNavigateContext();
    const [profileThumbnailBlob, setProfileThumbnailBlob] =
        React.useState(null);
    const [profileThumbnailUrl, setProfileThumbnailUrl] = React.useState(
        userInfo?.profileThumbnailUrl || ""
    );
    const [fullName, setFullName] = React.useState(userInfo?.fullName || "");
    const [nickname, setNickname] = React.useState(userInfo?.nickname || "");
    const [position, setPosition] = React.useState(userInfo?.position || "");
    const [website, setWebsite] = React.useState(userInfo?.website || "");
    const [introduction, setIntroduction] = React.useState(
        userInfo?.introduction || ""
    );
    const [canSubmit, setCanSubmit] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [openProfileThumbnail, setOpenProfileThumbnail] =
        React.useState(false);
    const inputFileRef = React.useRef(null);

    React.useEffect(() => {
        if (isLoading) {
            return setCanSubmit(false);
        }

        if (
            ((!Boolean(userInfo?.fullName) && !Boolean(fullName)) ||
                fullName === userInfo?.fullName) &&
            ((!Boolean(userInfo?.nickname) && !Boolean(nickname)) ||
                nickname === userInfo?.nickname) &&
            ((!Boolean(userInfo?.position) && !Boolean(position)) ||
                position === userInfo?.position) &&
            ((!Boolean(userInfo?.website) && !Boolean(website)) ||
                website === userInfo?.website) &&
            ((!Boolean(userInfo?.introduction) && !Boolean(introduction)) ||
                introduction === userInfo?.introduction) &&
            !profileThumbnailBlob
        ) {
            return setCanSubmit(false);
        }

        setCanSubmit(true);
    }, [isLoading, fullName, nickname, website, introduction]);

    const onFileChangeHandler = (event) => {
        const file = event.target?.files?.[0];
        if (!file) {
            setProfileThumbnailBlob(null);
            setProfileThumbnailUrl(userInfo?.profileThumbmailUrl);
            return;
        }
        setProfileThumbnailBlob(file);

        const reader = new FileReader();

        reader.onload = (event) => {
            setProfileThumbnailUrl(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    React.useEffect(() => {
        setOpenProfileThumbnail(false);
    }, [profileThumbnailUrl]);

    const onSubmitHandler = async () => {
        try {
            setIsLoading(true);

            const payload = {};
            if (Boolean(fullName)) {
                payload.fullName = fullName;
            }
            if (Boolean(nickname)) {
                payload.nickname = nickname;
            }
            if (Boolean(position)) {
                payload.position = position;
            }
            if (Boolean(website)) {
                payload.website = website;
            }
            if (Boolean(introduction)) {
                payload.introduction = introduction;
            }

            if (profileThumbnailBlob) {
                const { url } = await _uploadProfileThumbnail({
                    uid: userInfo?.id,
                    profileThumbnailBlob,
                });
                payload.profileThumbnailUrl = url;
            }

            await _setUserInfo({
                uid: userInfo?.id,
                payload,
            });
            userInfo?.refresh();
            goBack();
            setIsLoading(false);
        } catch (e) {
            console.dir(e);
        }
    };

    return (
        <>
            <main className="pages-protected-profile-edit">
                <div
                    className="profile-thumbnail"
                    onClick={() =>
                        setOpenProfileThumbnail(!openProfileThumbnail)
                    }
                >
                    <img
                        src={profileThumbnailUrl || ""}
                        alt="profile thumbnail"
                        loading="lazy"
                    />
                </div>
                <div className="form">
                    <WoilonnInput
                        label={t("label.profile.edit.name")}
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                    />
                    <WoilonnInput
                        label={t("label.profile.edit.nickname")}
                        value={nickname}
                        onChange={(event) => setNickname(event.target.value)}
                    />
                    <WoilonnInput
                        label={t("label.profile.edit.position")}
                        value={position}
                        onChange={(event) => setPosition(event.target.value)}
                    />
                    <WoilonnInput
                        label={t("label.profile.edit.website")}
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                    />
                    <WoilonnInput
                        label={t("label.profile.edit.introduction")}
                        value={introduction}
                        onChange={(event) =>
                            setIntroduction(event.target.value)
                        }
                    />
                </div>
                <CommonButton
                    color="primary"
                    disabled={!canSubmit}
                    loading={isLoading}
                    onClick={onSubmitHandler}
                >
                    {t("btn.finish")}
                </CommonButton>
            </main>
            <BottomSheet
                open={openProfileThumbnail}
                header={<div></div>}
                onDismiss={() => setOpenProfileThumbnail(false)}
            >
                <div className="bottom-sheet edit-profile-thumbnail">
                    {__PROFILE_THUMBNAIL_BUTTONS__.map((button) => (
                        <CommonButton
                            key={button.key}
                            type="contrast"
                            onClick={() => {
                                button.onClick({ inputFileRef });
                                // setOpenProfileThumbnail(false);
                            }}
                            icon={button.icon}
                        >
                            {t(button.i18nKey)}
                        </CommonButton>
                    ))}
                    <input
                        ref={inputFileRef}
                        type="file"
                        accept="image/jpg,impge/png,image/jpeg,image/gif"
                        onChange={onFileChangeHandler}
                        hidden
                    />
                </div>
            </BottomSheet>
        </>
    );
};

export default Edit;

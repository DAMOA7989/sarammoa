import React from "react";
import WoilonnInput from "components/input/WoilonnInput";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { BottomSheet } from "react-spring-bottom-sheet";
import ListButton from "components/button/ListButton";
import { useAuthContext } from "utils/auth";

const __PROFILE_THUMBNAIL_BUTTONS__ = [
    {
        key: "upload",
        i18nKey: "btn.profile.edit.profile_thumbnail.upload",
        onClick: ({ inputFileRef }) => {
            console.log("d inputFileRef", inputFileRef);
            inputFileRef.current.click();
        },
    },
    {
        key: "delete",
        i18nKey: "btn.profile.edit.profile_thumbnail.delete",
        onClick: () => {},
    },
];

const Edit = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuthContext();
    const [image, setImage] = React.useState(null);
    const [imageDataUrl, setImageDataUrl] = React.useState("");
    const [name, setName] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const [website, setWebsite] = React.useState("");
    const [introduction, setIntroduction] = React.useState("");
    const [canSubmit, setCanSubmit] = React.useState(false);
    const [openProfileThumbnail, setOpenProfileThumbnail] =
        React.useState(false);
    const inputFileRef = React.useRef(null);

    React.useEffect(() => {
        if (!Boolean(name)) {
            return setCanSubmit(false);
        }
        if (!Boolean(nickname)) {
            return setCanSubmit(false);
        }

        setCanSubmit(true);
    }, [name, nickname, website, introduction]);

    React.useEffect(() => {
        setImageDataUrl(userInfo?.photoURL);
    }, []);

    const onFileChangeHandler = (event) => {
        const file = event.target?.files?.[0];
        if (!file) {
            setImage(null);
            setImageDataUrl(userInfo?.photoURL);
            return;
        }
        setImage(file);

        const reader = new FileReader();

        reader.onload = (event) => {
            setImageDataUrl(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    React.useEffect(() => {
        setOpenProfileThumbnail(false);
    }, [imageDataUrl]);

    return (
        <main className="pages-protected-profile-edit">
            <div className="container">
                <div
                    className="profile-thumbnail"
                    onClick={() =>
                        setOpenProfileThumbnail(!openProfileThumbnail)
                    }
                >
                    <img src={imageDataUrl} />
                </div>
                <div className="form">
                    <WoilonnInput
                        label={t("label.profile.edit.name")}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <WoilonnInput
                        label={t("label.profile.edit.nickname")}
                        value={nickname}
                        onChange={(event) => setNickname(event.target.value)}
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
                    onClick={() => {}}
                >
                    {t("btn.finish")}
                </CommonButton>
            </div>
            <BottomSheet
                open={openProfileThumbnail}
                header={<div></div>}
                onDismiss={() => setOpenProfileThumbnail(false)}
            >
                <div>
                    {__PROFILE_THUMBNAIL_BUTTONS__.map((button) => (
                        <ListButton
                            key={button.key}
                            onClick={() => {
                                button.onClick({ inputFileRef });
                                // setOpenProfileThumbnail(false);
                            }}
                        >
                            {t(button.i18nKey)}
                        </ListButton>
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
        </main>
    );
};

export default Edit;

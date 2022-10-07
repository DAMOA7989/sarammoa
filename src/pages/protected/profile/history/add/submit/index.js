import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import WoilonnInput from "components/input/WoilonnInput";
import LazyImage from "components/surface/LazyImage";
import { useStatusContext } from "utils/status";
import { useAuthContext } from "utils/auth";
import { _post } from "utils/firebase/writing";

const ProfileHistoryAddSubmit = ({
    _idx,
    screenIdx,
    setScreenIdx,
    contents,
    setContents,
    cover,
    setCover,
    coverUrl,
    setCoverUrl,
}) => {
    const { t } = useTranslation();
    const { userInfo } = useAuthContext();
    const navigate = useNavigateContext();
    const { task } = useStatusContext();
    const [title, setTitle] = React.useState("");
    const [searchTag, setSearchTag] = React.useState("");
    const [searchTags, setSearchTags] = React.useState([]);
    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useLayoutEffect(() => {
        if (screenIdx === _idx) {
            navigate.setLayout({
                right: {
                    submit: {
                        title: t("btn.submit"),
                        onClick: () => onSubmitHandler(),
                        disabled: !canSubmit,
                    },
                },
                goBack: {
                    onClick: () => {
                        setScreenIdx(screenIdx - 1);
                    },
                },
                screenTitle: "title.profile.history.add",
            });
        }
    }, [screenIdx, canSubmit, title, searchTags]);

    React.useEffect(() => {
        if (!Boolean(title)) {
            return setCanSubmit(false);
        }

        setCanSubmit(true);
    }, [title]);

    const onSubmitHandler = React.useCallback(() => {
        task.run();
        _post({
            uid: userInfo?.id,
            contents,
            cover,
            title,
            searchTags,
        })
            .then(() => {
                task.finish();
                navigate.goBack();
            })
            .catch((e) => {
                console.dir(e);
                task.finish();
            });
    }, [title, searchTags]);

    return (
        <main className="pages-protected-profile-history-add-submit">
            <div className="title-image-container">
                <LazyImage src={coverUrl} alt="title image" />
            </div>
            <div className="inputs">
                <WoilonnInput
                    className="title"
                    label={t("label.profile.history.add.title")}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />
                <WoilonnInput
                    className="search-tag"
                    label={t("label.profile.history.add.search_tag")}
                    value={searchTag}
                    onChange={(event) => setSearchTag(event.target.value)}
                />
            </div>
        </main>
    );
};

export default ProfileHistoryAddSubmit;

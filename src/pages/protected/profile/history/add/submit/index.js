import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import WoilonnInput from "components/input/WoilonnInput";
import LazyImage from "components/surface/LazyImage";
import { useStatusContext } from "utils/status";

const ProfileHistoryAddSubmit = ({
    _idx,
    screenIdx,
    setScreenIdx,
    contents,
    setContents,
    cover,
    setCover,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const { task } = useStatusContext();
    const [title, setTitle] = React.useState("");
    const [searchTag, setSearchTag] = React.useState("");
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
    }, [screenIdx, canSubmit, title, searchTag]);

    React.useEffect(() => {
        if (!Boolean(title)) {
            return setCanSubmit(false);
        }

        setCanSubmit(true);
    }, [title]);

    const onSubmitHandler = React.useCallback(() => {
        const payload = {
            contents,
            cover,
            title,
            searchTag,
        };

        task.run();
        setTimeout(() => {
            task.finish();
        }, 2000);
    }, [title, searchTag]);

    return (
        <main className="pages-protected-profile-history-add-submit">
            <div className="title-image-container">
                <LazyImage src={cover} alt="title image" />
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

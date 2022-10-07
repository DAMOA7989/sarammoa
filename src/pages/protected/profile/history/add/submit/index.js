import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import WoilonnInput from "components/input/WoilonnInput";
import LazyImage from "components/surface/LazyImage";

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
    const [title, setTitle] = React.useState("");
    const [searchTag, setSearchTag] = React.useState("");

    React.useLayoutEffect(() => {
        if (screenIdx === _idx) {
            navigate.setLayout({
                right: {
                    submit: {
                        title: t("btn.submit"),
                        onClick: onSubmitHandler,
                    },
                },
            });
        }
    }, [screenIdx]);

    const onSubmitHandler = () => {};

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

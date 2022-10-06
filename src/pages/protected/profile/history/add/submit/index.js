import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import WoilonnInput from "components/input/WoilonnInput";

const ProfileHistoryAddSubmit = ({
    _idx,
    screenIdx,
    setScreenIdx,
    contents,
    setContents,
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

    const onSubmitHandler = () => {
        console.log("d submit", contents);
    };

    return (
        <main className="pages-protected-profile-history-add-submit">
            <div className="title-image-container">
                <img src={null} alt="title image" />
            </div>
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
        </main>
    );
};

export default ProfileHistoryAddSubmit;

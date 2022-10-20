import React from "react";
import SearchBar from "components/input/SearchBar";
import { useTranslation } from "react-i18next";

const Followers = ({ uid }) => {
    const { t } = useTranslation();
    const [search, setSearch] = React.useState("");

    return (
        <main className="modals-profile-followers">
            <SearchBar
                placeholder={t("placeholder.search")}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />
        </main>
    );
};

export default Followers;

import React from "react";
import { useTranslation } from "react-i18next";
import { useModalContext } from "utils/modal";

const NewsFeed = () => {
    const { t } = useTranslation();
    const { displayModal, dismissModal } = useModalContext();

    return (
        <main className="pages-public-newsfeed">
            newsfeed
            <button
                onClick={() => {
                    displayModal({
                        path: "status/Pending",
                    });
                }}
            >
                displayModal
            </button>
            <button
                onClick={() => {
                    dismissModal();
                }}
            >
                dismissModal
            </button>
        </main>
    );
};

export default NewsFeed;

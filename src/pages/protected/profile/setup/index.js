import React from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "utils/auth";

const __ROWS__ = [
    {
        key: "general",
        title: "title.setup.general",
        cols: [
            {
                key: "notice",
                i18nKey: "text.setup.notice",
                onClick: () => {},
            },
            {
                key: "clear_cache",
                i18nKey: "text.setup.clear_cache",
                onClick: () => {},
            },
        ],
    },
    {
        key: "usage_information",
        title: "title.setup.usage_information",
        cols: [
            {
                key: "send_usage_information",
                i18nKey: "text.setup.send_usage_information",
                onClick: () => {},
            },
        ],
    },
    {
        key: "law",
        title: "title.setup.law",
        cols: [
            {
                key: "privacy_policy",
                i18nKey: "text.setup.privacy_policy",
                onClick: () => {},
            },
            {
                key: "terms_of_service",
                i18nKey: "text.setup.terms_of_service",
                onClick: () => {},
            },
        ],
    },
    {
        key: "individual",
        title: "title.setup.individual",
        cols: [
            {
                key: "bug_report",
                i18nKey: "text.setup.bug_report",
                onClick: () => {},
            },
            {
                key: "sign_out",
                i18nKey: "text.setup.sign_out",
                onClick: async ({ signOut }) => {
                    await signOut();
                },
            },
        ],
    },
];

const Setup = () => {
    const { t } = useTranslation();
    const { signOut } = useAuthContext();

    return (
        <main className="pages-protected-profile-setup">
            {__ROWS__.map((row) => (
                <section key={row.key} className={`rows ${row.key}`}>
                    <h3 className="title">{t(row.title)}</h3>
                    <section className="cols">
                        {(row?.cols || []).map((col) => (
                            <article
                                key={col.key}
                                className={`${col.key} list-button`}
                                onClick={() => col.onClick({ signOut })}
                            >
                                <span>{t(col.i18nKey)}</span>
                            </article>
                        ))}
                    </section>
                </section>
            ))}
        </main>
    );
};

export default Setup;

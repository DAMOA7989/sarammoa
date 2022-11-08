import React from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "utils/auth";
import ListButton from "components/button/ListButton";
import WoilonnToggle from "components/input/WoilonnToggle";
import { useNavigateContext } from "utils/navigate";
import { useStatusContext } from "utils/status";
import { BottomSheet } from "react-spring-bottom-sheet";
import CommonButton from "components/button/CommonButton";
import { resources } from "i18n";

const __ROWS__ = [
    {
        key: "general",
        title: "title.setup.general",
        cols: [
            // {
            //     key: "notice",
            //     i18nKey: "text.setup.notice",
            //     onClick: () => {},
            // },
            {
                key: "push_notice",
                i18nKey: "text.setup.push_notice",
                right: ({ checkedPushNotice }) => (
                    <WoilonnToggle value={checkedPushNotice} />
                ),
                onClick: ({ checkedPushNotice, setCheckedPushNotice }) => {
                    setCheckedPushNotice(!checkedPushNotice);
                },
            },
            {
                key: "change_lang",
                i18nKey: "text.setup.change_lang",
                right: ({ t }) => (
                    <span>
                        {t(`lang.${window.localStorage.getItem("i18nextLng")}`)}
                    </span>
                ),
                onClick: ({ setOpenLangBottomSheet }) => {
                    setOpenLangBottomSheet(true);
                },
            },
            // {
            //     key: "clear_cache",
            //     i18nKey: "text.setup.clear_cache",
            //     onClick: () => {},
            // },
        ],
    },
    {
        key: "usage_information",
        title: "title.setup.usage_information",
        cols: [
            {
                key: "send_usage_information",
                i18nKey: "text.setup.send_usage_information",
                right: ({ checkedUsageInformation }) => (
                    <WoilonnToggle value={checkedUsageInformation} />
                ),
                onClick: ({
                    checkedUsageInformation,
                    setCheckedUsageInformation,
                }) => {
                    setCheckedUsageInformation(!checkedUsageInformation);
                },
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
                onClick: () => {
                    window.open(
                        "https://damoa7989.notion.site/7989-c26ba8d9f3a74ebd87e19026cf0fc260",
                        "_blank"
                    );
                },
            },
            {
                key: "terms_of_service",
                i18nKey: "text.setup.terms_of_service",
                onClick: () => {
                    window.open(
                        "https://damoa7989.notion.site/7989-8c05ce548ab34699a072d84d770fd51c",
                        "_blank"
                    );
                },
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
                onClick: () => {
                    window.location.href = "mailto:yoondev3434@gmail.com";
                },
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
    const { t, i18n } = useTranslation();
    const { signOut } = useAuthContext();
    const navigate = useNavigateContext();
    const [checkedUsageInformation, setCheckedUsageInformation] =
        React.useState(true);
    const [checkedPushNotice, setCheckedPushNotice] = React.useState(true);
    const [openLangBottomSheet, setOpenLangBottomSheet] = React.useState(false);

    React.useLayoutEffect(() => {
        navigate.setLayout({
            screenTitle: "title.screen.setup",
        });
    }, []);

    return (
        <>
            <main className="pages-protected-profile-setup">
                {__ROWS__.map((row) => (
                    <section key={row.key} className={`rows ${row.key}`}>
                        <h3 className="title">{t(row.title)}</h3>
                        <section className="cols">
                            {(row?.cols || []).map((col) => (
                                <ListButton
                                    key={col.key}
                                    className={`${col.key} list-button`}
                                    onClick={() =>
                                        col.onClick({
                                            signOut,
                                            checkedUsageInformation,
                                            setCheckedUsageInformation,
                                            checkedPushNotice,
                                            setCheckedPushNotice,
                                            setOpenLangBottomSheet,
                                        })
                                    }
                                >
                                    <span>{t(col.i18nKey)}</span>
                                    {col.right &&
                                        col.right({
                                            t,
                                            checkedUsageInformation,
                                            checkedPushNotice,
                                        })}
                                </ListButton>
                            ))}
                        </section>
                    </section>
                ))}
            </main>
            <BottomSheet
                open={openLangBottomSheet}
                onDismiss={() => setOpenLangBottomSheet(false)}
            >
                <div className="bottom-sheet lang">
                    <ul>
                        {Object.keys(resources || {}).map((lang) => (
                            <li key={lang}>
                                <CommonButton
                                    className="lang-button"
                                    color="primary"
                                    onClick={() => {
                                        i18n.changeLanguage(lang);
                                        setOpenLangBottomSheet(false);
                                    }}
                                >
                                    {t(`lang.${lang}`)}
                                </CommonButton>
                            </li>
                        ))}
                    </ul>
                </div>
            </BottomSheet>
        </>
    );
};

export default Setup;

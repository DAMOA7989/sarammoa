import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import { useOutletContext } from "react-router-dom";
import WoilonnSelect from "components/input/WoilonnSelect";
import WoilonnInput from "components/input/WoilonnInput";

const ConnectCreateInfo = () => {
    const { t } = useTranslation();
    const { screenIdx, setScreenIdx } = useOutletContext();
    const navigate = useNavigateContext();

    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_PURPOSE":
                    return {
                        ...state,
                        purpose: action.payload?.value,
                    };
                case "TYPE_TITLE":
                    return {
                        ...state,
                        title: action.payload?.value,
                    };
                case "TYPE_DESCRIPTION":
                    return {
                        ...state,
                        description: action.payload?.value,
                    };
            }
        },
        {
            purpose: null,
            title: "",
            description: "",
        }
    );

    React.useLayoutEffect(() => {
        navigate.setLayout({
            right: {
                next: {
                    title: t("btn.next"),
                    onClick: () => {
                        setScreenIdx(screenIdx + 1);
                    },
                },
            },
            screenTitle: "title.connect.create.info",
        });
    }, []);

    return (
        <main className="protected-connect-create-info">
            <div className="inputs">
                <WoilonnSelect
                    label={t("label.connect.create.info.purpose")}
                    value={state.purpose}
                    onChange={(value) =>
                        dispatch({
                            type: "SET_PURPOSE",
                            payload: {
                                value,
                            },
                        })
                    }
                    datas={[
                        {
                            key: "app_release",
                            i18nKey:
                                "option.connect.create.info.purpose.app_release",
                        },
                        {
                            key: "competition",
                            i18nKey:
                                "option.connect.create.info.purpose.competition",
                        },
                        {
                            key: "graduation_work",
                            i18nKey:
                                "option.connect.create.info.purpose.graduation_work",
                        },
                    ]}
                />
                <WoilonnInput
                    label={t("label.connect.create.info.title")}
                    value={state.title}
                    onChange={(event) => {
                        dispatch({
                            type: "TYPE_TITLE",
                            payload: {
                                value: event.target.value,
                            },
                        });
                    }}
                />
                <WoilonnInput
                    label={t("label.connect.create.info.description")}
                    value={state.description}
                    onChange={(event) =>
                        dispatch({
                            type: "TYPE_DESCRIPTION",
                            payload: {
                                value: event.target.value,
                            },
                        })
                    }
                    multiline={true}
                />
            </div>
        </main>
    );
};

export default ConnectCreateInfo;

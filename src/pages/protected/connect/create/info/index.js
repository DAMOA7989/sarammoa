import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import { useOutletContext } from "react-router-dom";
import WoilonnSelect from "components/input/WoilonnSelect";
import WoilonnInput from "components/input/WoilonnInput";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as PlusIcon } from "assets/images/icons/connect/plus.svg";
import { ReactComponent as EditIcon } from "assets/images/icons/connect/edit.svg";
import _ from "lodash";
import { useModal } from "utils/modal";

const ConnectCreateInfo = () => {
    const { t } = useTranslation();
    const { screenIdx, setScreenIdx } = useOutletContext();
    const modal = useModal("connect/create/MemberComposition");
    const navigate = useNavigateContext();

    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_CAN_NEXT":
                    return {
                        ...state,
                        canNext: action.payload?.flag,
                    };
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
                case "SET_MEMBERS":
                    return {
                        ...state,
                        members: action.payload?.members,
                    };
            }
        },
        {
            purpose: null,
            title: "",
            description: "",
            members: [],
            canNext: false,
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
                    disabled: !state.canNext,
                },
            },
            screenTitle: "title.connect.create.info",
        });
    }, [state.canNext]);

    React.useEffect(() => {
        if (!state.purpose)
            return dispatch({
                type: "SET_CAN_NEXT",
                payload: {
                    flag: false,
                },
            });

        if (!Boolean(state.title))
            return dispatch({
                type: "SET_CAN_NEXT",
                payload: {
                    flag: false,
                },
            });

        if (state.members.reduce((p, c) => p + Number(c.person), 0) === 0)
            return dispatch({
                type: "SET_CAN_NEXT",
                payload: {
                    flag: false,
                },
            });

        dispatch({
            type: "SET_CAN_NEXT",
            payload: {
                flag: true,
            },
        });
    }, [state.purpose, state.title, state.members]);

    return (
        <main className="protected-connect-create-info">
            <div className="inputs">
                <WoilonnSelect
                    className={"purpose"}
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
                    className={"title"}
                    label={t("label.connect.create.info.title")}
                    placeholder={t("placeholder.connect.create.info.title")}
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
                    className="description"
                    label={t("label.connect.create.info.description")}
                    placeholder={t(
                        "placeholder.connect.create.info.description"
                    )}
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
            <div
                className={`member-composition ${
                    state.members.reduce(
                        (previousValue, currentValue) =>
                            previousValue + Number(currentValue.person),
                        0
                    ) > 0 && "fill"
                }`}
            >
                <header>
                    <h3 className="title">
                        {t("title.connect.create.info.member_composition")}
                    </h3>
                    <span className="count">{`${state.members.reduce(
                        (previousValue, currentValue) =>
                            previousValue + Number(currentValue.person),
                        0
                    )} ${t("text.person")}`}</span>
                </header>
                <main>
                    <ul>
                        {state?.members.map((member, idx) => (
                            <li key={member.position.key}>
                                <div className="container">
                                    <span className="role">
                                        {t(member.position.i18nKey)}
                                    </span>
                                    <span className="person">{`${
                                        member.person
                                    } ${t("text.person")}`}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </main>
                <footer>
                    <CommonButton
                        className={"edit-btn"}
                        type="text"
                        color="primary"
                        style={{ padding: "0.625em" }}
                        onClick={() => {
                            modal.open({
                                params: {
                                    state,
                                    dispatch,
                                    closeModal: modal.close,
                                },
                                options: {},
                            });
                        }}
                    >
                        <EditIcon />
                    </CommonButton>
                </footer>
            </div>
        </main>
    );
};

export default ConnectCreateInfo;

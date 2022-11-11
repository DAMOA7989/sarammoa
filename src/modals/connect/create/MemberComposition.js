import React from "react";
import { useTranslation } from "react-i18next";
import WoilonnInput from "components/input/WoilonnInput";
import WoilonnSelect from "components/input/WoilonnSelect";
import { ReactComponent as AddIcon } from "assets/images/icons/connect/add.svg";
import { ReactComponent as RemoveIcon } from "assets/images/icons/connect/remove.svg";
import { ReactComponent as CheckIcon } from "assets/images/icons/connect/check.svg";
import RippleEffect from "components/surface/RippleEffect";
import CommonButton from "components/button/CommonButton";

const MemberComposition = ({
    modalId,
    state: parentState,
    dispatch: parentDispatch,
    closeModal,
}) => {
    const { t } = useTranslation();

    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "ADD_MEMBER":
                    const idx = state.members.findIndex(
                        (x) =>
                            x.position.key ===
                            action.payload?.member.position.key
                    );

                    return {
                        ...state,
                        members:
                            idx >= 0
                                ? [
                                      ...state.members.slice(0, idx),
                                      action.payload?.member,
                                      ...state.members.slice(
                                          idx + 1,
                                          state.members.length
                                      ),
                                  ]
                                : [...state.members, action.payload?.member],
                        position: null,
                        person: "",
                    };
                case "DELETE_MEMBER":
                    return {
                        ...state,
                        members: state.members.filter(
                            (item) => item.position.key !== action.payload?.key
                        ),
                    };
                case "SET_POSITION":
                    return {
                        ...state,
                        position: action.payload?.value,
                    };
                case "SET_PERSON":
                    return {
                        ...state,
                        person: action.payload?.value,
                    };
                case "SET_CAN_ADD":
                    return {
                        ...state,
                        canAdd: action.payload?.flag,
                    };
                case "SET_CAN_SUBMIT":
                    return {
                        ...state,
                        canSubmit: action.payload?.flag,
                    };
            }
        },
        {
            members: [],
            position: null,
            person: "",
            canAdd: false,
            canSubmit: false,
        }
    );

    React.useEffect(() => {
        if (!state.position)
            return dispatch({
                type: "SET_CAN_ADD",
                payload: {
                    flag: false,
                },
            });
        if (!Boolean(state.person))
            return dispatch({
                type: "SET_CAN_ADD",
                payload: {
                    flag: false,
                },
            });

        dispatch({
            type: "SET_CAN_ADD",
            payload: {
                flag: true,
            },
        });
    }, [state.position, state.person]);

    React.useEffect(() => {
        if (state.members.length > 0) {
            dispatch({
                type: "SET_CAN_SUBMIT",
                payload: {
                    flag: true,
                },
            });
        } else {
            dispatch({
                type: "SET_CAN_SUBMIT",
                payload: {
                    flag: false,
                },
            });
        }
    }, [state.members.length]);

    const onAddHandler = () => {
        if (!state.position || !Boolean(state.person)) return;

        const position = state.position;
        const person = state.person;

        dispatch({
            type: "ADD_MEMBER",
            payload: {
                member: { position, person },
            },
        });
    };

    const onRemoveHandler = (member) => {
        dispatch({
            type: "DELETE_MEMBER",
            payload: {
                key: member.position.key,
            },
        });
    };

    const onCreateHandler = () => {
        parentDispatch({
            type: "SET_MEMBERS",
            payload: {
                members: state.members,
            },
        });
        closeModal();
    };

    return (
        <main className="modals-connect-create-member-composition">
            <header>
                <span className="position">
                    {t("title.connect.create.info.member_composition.position")}
                </span>
                <span className="person">
                    {t("title.connect.create.info.member_composition.person")}
                </span>
                <span className="total">
                    {Object.values(state?.members || {}).reduce(
                        (p, c) => p + Number(c.person),
                        0
                    )}
                </span>
            </header>
            <main>
                <ul>
                    {state.members.map((member, idx) => (
                        <li key={idx}>
                            <div className="container">
                                <div className="position">
                                    {t(member.position.i18nKey)}
                                </div>
                                <div className="person">{member.person}</div>
                                <RippleEffect
                                    className="remove"
                                    onClick={() => onRemoveHandler(member)}
                                >
                                    <RemoveIcon />
                                </RippleEffect>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="add-row">
                    <div className="position">
                        <WoilonnSelect
                            value={state.position}
                            onChange={(item) =>
                                dispatch({
                                    type: "SET_POSITION",
                                    payload: {
                                        value: item,
                                    },
                                })
                            }
                            datas={[
                                {
                                    key: "developer",
                                    i18nKey: "text.developer",
                                },
                                {
                                    key: "designer",
                                    i18nKey: "text.designer",
                                },
                                {
                                    key: "planner",
                                    i18nKey: "text.planner",
                                },
                                {
                                    key: "marketer",
                                    i18nKey: "text.marketer",
                                },
                            ]}
                        />
                    </div>
                    <div className="person">
                        <WoilonnInput
                            type="number"
                            value={state.person}
                            onChange={(event) => {
                                const { value } = event.target;
                                const onlyNumberPersonValue = value
                                    .replace(/[^0-9.]/g, "")
                                    .replace(/(\..*)\./g, "$1");
                                dispatch({
                                    type: "SET_PERSON",
                                    payload: {
                                        value: onlyNumberPersonValue,
                                    },
                                });
                            }}
                        />
                    </div>

                    <RippleEffect
                        className={`add ${state.canAdd && "active"}`}
                        onClick={state.canAdd ? onAddHandler : null}
                    >
                        <CheckIcon />
                    </RippleEffect>
                </div>
            </main>
            <footer>
                <CommonButton
                    className="btn-create"
                    color="primary"
                    onClick={onCreateHandler}
                    disabled={!state.canSubmit}
                >
                    {t("btn.create_team")}
                </CommonButton>
            </footer>
        </main>
    );
};

export default MemberComposition;

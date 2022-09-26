import React from "react";
import { useTranslation, Trans } from "react-i18next";
import WoilonnInput from "components/input/WoilonnInput";
import CommonButton from "components/button/CommonButton";
import { generateRandomNumberString } from "utils/string";
import { toast } from "react-toastify";
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirm,
    validateVerifyCode,
} from "utils/validator";

const EmailFind = () => {
    const { t } = useTranslation();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_EMAIL":
                    return {
                        ...state,
                        email: action.payload?.email,
                    };
                case "SET_VERIFICATION_CODE":
                    return {
                        ...state,
                        verificationCode: action.payload?.verificationCode,
                    };
                case "SET_NEW_PASSWORD":
                    return {
                        ...state,
                        newPassword: action.payload?.newPassword,
                    };
                case "SET_NEW_PASSWORD_CONFIRM":
                    return {
                        ...state,
                        newPasswordConfirm: action.payload?.newPasswordConfirm,
                    };
                case "CAN_SEND":
                    return {
                        ...state,
                        canSend: true,
                    };
                case "CAN_NOT_SEND":
                    return {
                        ...state,
                        canSend: false,
                    };
                case "SEND_EMAIL_PENDING":
                    return {
                        ...state,
                        send: false,
                        sendLoading: true,
                        realCode: action.payload?.realCode,
                    };
                case "SEND_EMAIL_FULFILLED":
                    return {
                        ...state,
                        send: true,
                        sendLoading: false,
                    };
                case "SEND_EMAIL_REJECTED":
                    return {
                        ...state,
                        send: false,
                        sendLoading: false,
                        realCode: "",
                    };
                case "CAN_CONFIRM":
                    return {
                        ...state,
                        canConfirm: true,
                    };
                case "CAN_NOT_CONFIRM":
                    return {
                        ...state,
                        canConfirm: false,
                    };
                case "CONFIRM_PENDING":
                    return {
                        ...state,
                        confirm: false,
                        confirmLoading: true,
                    };
                case "CONFIRM_FULFILLED":
                    return {
                        ...state,
                        confirm: true,
                        confirmLoading: false,
                    };
                case "CONFIRM_REJECTED":
                    return {
                        ...state,
                        confirm: false,
                        confirmLoading: false,
                    };
                case "SUBMIT_PENDING":
                    return {
                        ...state,
                        submit: false,
                        submitLoading: true,
                    };
                case "SUBMIT_FULFILLED":
                    return {
                        ...state,
                        submit: true,
                        submitLoading: false,
                    };
                case "SUBMIT_REJECTED":
                    return {
                        ...state,
                        submit: false,
                        submitLoading: false,
                    };
                case "CAN_SUBMIT":
                    return {
                        ...state,
                        canSubmit: true,
                    };
                case "CAN_NOT_SUBMIT":
                    return {
                        ...state,
                        canSubmit: false,
                    };
            }
        },
        {
            email: "",
            verificationCode: "",
            newPassword: "",
            newPasswordConfirm: "",
            send: false,
            sendLoading: false,
            canSend: false,
            realCode: "",
            confirm: false,
            confirmLoading: false,
            canConfirm: false,
            submit: false,
            submitLoading: false,
            canSubmit: false,
        }
    );

    React.useEffect(() => {
        if (!validateEmail(state.email).success) {
            return dispatch({
                type: "CAN_NOT_SEND",
            });
        }

        return dispatch({
            type: "CAN_SEND",
        });
    }, [state.email]);

    React.useEffect(() => {
        if (!validateVerifyCode(state.verificationCode).success) {
            return dispatch({
                type: "CAN_NOT_CONFIRM",
            });
        }

        return dispatch({
            type: "CAN_CONFIRM",
        });
    }, [state.verificationCode]);

    React.useEffect(() => {
        if (!validateEmail(state.email).success) {
            return dispatch({
                type: "CAN_NOT_SUBMIT",
            });
        }

        if (!validatePassword(state.newPassword).success) {
            return dispatch({
                type: "CAN_NOT_SUBMIT",
            });
        }

        if (
            !validatePasswordConfirm(
                state.newPassword,
                state.newPasswordConfirm
            ).success
        ) {
            return dispatch({
                type: "CAN_NOT_SUBMIT",
            });
        }

        return dispatch({
            type: "CAN_SUBMIT",
        });
    }, [state.email, state.newPassword, state.newPasswordConfirm]);

    const onSendEmailHandler = () => {
        const randomNumberString = generateRandomNumberString();
        dispatch({
            type: "SEND_EMAIL_PENDING",
            payload: {
                realCode: randomNumberString,
            },
        });

        setTimeout(() => {
            dispatch({
                type: "SEND_EMAIL_FULFILLED",
            });
        }, 2000);
    };

    const onConfirmHandler = () => {
        dispatch({
            type: "CONFIRM_PENDING",
        });

        setTimeout(() => {
            dispatch({
                type: "CONFIRM_FULFILLED",
            });
        }, 2000);
    };

    const onSubmitHandler = () => {
        dispatch({
            type: "SUBMIT_PENDING",
        });

        setTimeout(() => {
            dispatch({
                type: "SUBMIT_FULFILLED",
            });
        }, 2000);
    };

    return (
        <main className="pages-auth-email-find">
            <div className="container">
                <p className="welcome-message">
                    <Trans
                        t={t}
                        i18nKey="text.auth.email.find.welcome_message"
                        components={{
                            big: (
                                <span
                                    style={{
                                        fontSize: "32px",
                                        fontWeight: 700,
                                    }}
                                />
                            ),
                        }}
                    />
                </p>
                <div className="fields">
                    <div className="input-fields">
                        <WoilonnInput
                            type="email"
                            label={t("label.email")}
                            value={state.email}
                            onChange={(event) =>
                                dispatch({
                                    type: "SET_EMAIL",
                                    payload: {
                                        email: event.target.value,
                                    },
                                })
                            }
                            disabled={state.send}
                            onKeyPress={(event) => {
                                if (!state.canSend) return;
                                if (state.send) return;
                                if (event.key === "Enter") {
                                    onSendEmailHandler();
                                }
                            }}
                        />
                        {state.send && !state.confirm && (
                            <WoilonnInput
                                type="number"
                                label={t("label.verification_code")}
                                value={state.verificationCode}
                                onChange={(event) =>
                                    dispatch({
                                        type: "SET_VERIFICATION_CODE",
                                        payload: {
                                            verificationCode:
                                                event.target.value,
                                        },
                                    })
                                }
                                disabled={state.confirm}
                                onKeyPress={(event) => {
                                    if (!state.canConfirm) return;
                                    if (state.confirm) return;
                                    if (event.key === "Enter") {
                                        onConfirmHandler();
                                    }
                                }}
                            />
                        )}
                        {state.confirm && (
                            <>
                                <WoilonnInput
                                    type="password"
                                    label={t("label.new_password")}
                                    value={state.newPassword}
                                    onChange={(event) =>
                                        dispatch({
                                            type: "SET_NEW_PASSWORD",
                                            payload: {
                                                newPassword: event.target.value,
                                            },
                                        })
                                    }
                                    onKeyPress={(event) => {
                                        if (!state.canSubmit) return;
                                        if (event.key === "Enter") {
                                            onSubmitHandler();
                                        }
                                    }}
                                />
                                <WoilonnInput
                                    type="password"
                                    label={t("label.new_password_confirm")}
                                    value={state.newPasswordConfirm}
                                    onChange={(event) =>
                                        dispatch({
                                            type: "SET_NEW_PASSWORD_CONFIRM",
                                            payload: {
                                                newPasswordConfirm:
                                                    event.target.value,
                                            },
                                        })
                                    }
                                    onKeyPress={(event) => {
                                        if (!state.canSubmit) return;
                                        if (event.key === "Enter") {
                                            onSubmitHandler();
                                        }
                                    }}
                                />
                            </>
                        )}
                    </div>
                    <div className="button-fields">
                        {!state.send && (
                            <CommonButton
                                className="send-button"
                                color="secondary"
                                loading={state.sendLoading}
                                disabled={state.send || !state.canSend}
                                onClick={onSendEmailHandler}
                            >
                                {t("button.send_verification_code")}
                            </CommonButton>
                        )}
                        {state.send && !state.confirm && (
                            <CommonButton
                                className="confirm-button"
                                color="secondary"
                                loading={state.confirmLoading}
                                disabled={state.confirm || !state.canConfirm}
                                onClick={onConfirmHandler}
                            >
                                {t("button.confirm_verification_code")}
                            </CommonButton>
                        )}
                    </div>
                </div>
                <div className="buttons">
                    <CommonButton
                        className="submit-button"
                        color="primary"
                        loading={state.submitLoading}
                        disabled={!state.canSubmit}
                        onClick={onSubmitHandler}
                    >
                        {t("button.do_reset")}
                    </CommonButton>
                </div>
            </div>
        </main>
    );
};

export default EmailFind;

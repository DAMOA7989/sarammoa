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
import { displayTime } from "utils/string";
import {
    _sendVerificationEmail,
    _sendPasswordResetEmail,
    _verifyPasswordResetCode,
    _confirmPasswordReset,
} from "utils/firebase/auth";
import { useSearchParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useNavigateContext } from "utils/navigate";

const EmailFind = () => {
    const { t } = useTranslation();
    const [search] = useSearchParams();
    const navigate = useNavigateContext();
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
                        restTime: -1,
                    };
                case "SEND_EMAIL_FULFILLED":
                    return {
                        ...state,
                        send: true,
                        sendLoading: false,
                        restTime: 60 * 5,
                    };
                case "SEND_EMAIL_REJECTED":
                    return {
                        ...state,
                        send: false,
                        sendLoading: false,
                        realCode: "",
                        restTime: -1,
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
                case "TICK":
                    return {
                        ...state,
                        restTime: state.restTime - 1,
                    };
                case "CONFIRM_PENDING":
                    return {
                        ...state,
                        confirm: false,
                        confirmLoading: true,
                        email: "",
                    };
                case "CONFIRM_FULFILLED":
                    return {
                        ...state,
                        confirm: true,
                        confirmLoading: false,
                        email: action.payload?.email,
                    };
                case "CONFIRM_REJECTED":
                    return {
                        ...state,
                        confirm: false,
                        confirmLoading: false,
                        email: "",
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
            restTime: -1,
            submit: false,
            submitLoading: false,
            canSubmit: false,
        }
    );
    const timerId = React.useRef(null);

    React.useEffect(() => {
        const actionCode = search.get("oobCode");
        if (Boolean(actionCode)) {
            dispatch({
                type: "CONFIRM_PENDING",
            });

            _verifyPasswordResetCode({ actionCode })
                .then((email) => {
                    dispatch({
                        type: "CONFIRM_FULFILLED",
                        payload: {
                            email,
                        },
                    });
                })
                .catch((e) => {
                    console.dir(e);
                    dispatch({
                        type: "CONFIRM_REJECTED",
                    });
                });
        }
    }, []);

    React.useEffect(() => {
        if (state.send) {
            timerId.current = setInterval(() => {
                dispatch({
                    type: "TICK",
                });
            }, 1000);
        }

        return () => clearTimeout(timerId.current);
    }, [state.send]);

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

        if (
            !validatePassword(state.newPassword, {
                lower: 1,
                upper: 1,
                numeric: 1,
                special: 1,
                length: [9, Infinity],
            }).success
        ) {
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
        // In current, no use randomNumberString
        const randomNumberString = generateRandomNumberString(6);
        dispatch({
            type: "SEND_EMAIL_PENDING",
            payload: {
                realCode: randomNumberString,
            },
        });

        _sendPasswordResetEmail({ email: state.email })
            .then(() => {
                dispatch({
                    type: "SEND_EMAIL_FULFILLED",
                });
                toast.success(t("toast.auth.email.signup.bottom_sheet"));
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "SEND_EMAIL_REJECTED",
                });
            });

        // _sendVerificationEmail({
        //     code: randomNumberString,
        //     email: state.email,
        // })
        //     .then(() => {
        //         dispatch({
        //             type: "SEND_EMAIL_FULFILLED",
        //         });
        //         toast.success(t("toast.auth.email.signup.bottom_sheet"));
        //     })
        //     .catch((e) => {
        //         console.dir(e);
        //         dispatch({
        //             type: "SEND_EMAIL_REJECTED",
        //         });
        //     });
    };

    const onConfirmHandler = () => {
        dispatch({
            type: "CONFIRM_PENDING",
        });

        if (
            state.verificationCode === state.realCode &&
            Boolean(state.verificationCode && Boolean(state.realCode))
        ) {
            dispatch({
                type: "CONFIRM_FULFILLED",
            });
        } else {
            toast.error(t("toast.auth.email.signup.verify_rejected"));
            dispatch({
                type: "CONFIRM_REJECTED",
            });
        }
    };

    const onSubmitHandler = () => {
        const actionCode = search.get("oobCode");
        if (!Boolean(actionCode)) {
            dispatch({
                type: "SUBMIT_REJECTED",
            });
            return;
        }

        dispatch({
            type: "SUBMIT_PENDING",
        });

        _confirmPasswordReset({ actionCode, newPassword: state.newPassword })
            .then(() => {
                dispatch({
                    type: "SUBMIT_FULFILLED",
                });
                toast.success(t("toast.auth.email.find.submit_success"));
                navigate.replace({
                    pathname: "/auth/email/signin",
                    mode: "main",
                    screenTitle: "title.auth.email.signin",
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "SUBMIT_REJECTED",
                });
            });
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
                {state.confirmLoading ? (
                    <CircularProgress color="primary" size={45} />
                ) : (
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
                                disabled={state.confirm}
                                onKeyPress={(event) => {
                                    if (!state.canSend) return;
                                    if (state.send) return;
                                    if (event.key === "Enter") {
                                        onSendEmailHandler();
                                    }
                                }}
                            />
                            {/* {state.send && !state.confirm && (
                            <WoilonnInput
                                type="number"
                                label={`${t("label.verification_code")} (${t(
                                    "label.verify_code_rest_time",
                                    {
                                        time: displayTime(state.restTime),
                                    }
                                )})`}
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
                                    if (state.restTime < 0) return;
                                    if (!state.canConfirm) return;
                                    if (state.confirm) return;
                                    if (event.key === "Enter") {
                                        onConfirmHandler();
                                    }
                                }}
                            />
                        )} */}
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
                                                    newPassword:
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
                            {!state.confirm && (
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
                            {/* {state.send && !state.confirm && (
                            <CommonButton
                                className="confirm-button"
                                color="secondary"
                                loading={state.confirmLoading}
                                disabled={
                                    state.confirm ||
                                    !state.canConfirm ||
                                    state.restTime < 0
                                }
                                onClick={onConfirmHandler}
                            >
                                {t("button.confirm_verification_code")}
                            </CommonButton>
                        )} */}
                        </div>
                    </div>
                )}
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

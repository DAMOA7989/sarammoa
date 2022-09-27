import React from "react";
import { useTranslation, Trans } from "react-i18next";
import WoilonnInput from "components/input/WoilonnInput";
import CommonButton from "components/button/CommonButton";
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirm,
    validateVerifyCode,
} from "utils/validator";
import { useAuthContext } from "utils/auth";
import { useNavigateContext } from "utils/navigate";
import { toast } from "react-toastify";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useStatusContext } from "utils/status";
import { generateRandomNumberString, displayTime } from "utils/string";
import { _sendVerificationEmail } from "utils/firebase/auth";

const EmailSignup = () => {
    const { t } = useTranslation();
    const { signUp } = useAuthContext();
    const navigate = useNavigateContext();
    const { task } = useStatusContext();
    const [email, setEmail] = React.useState("");
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] =
        React.useState("");
    const [openBottomSheet, setOpenBottomSheet] = React.useState(false);
    const [emailVerify, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "CAN_SEND_EMAIL":
                    return {
                        ...state,
                        canSend: true,
                    };
                case "CAN_NOT_SEND_EMAIL":
                    return {
                        ...state,
                        canSend: false,
                    };
                case "SEND_EMAIL_PENDING":
                    return {
                        ...state,
                        sendLoading: true,
                        send: false,
                        realCode: action.payload?.realCode,
                        restTime: -1,
                    };
                case "SEND_EMAIL_FULFILLED":
                    return {
                        ...state,
                        sendLoading: false,
                        send: true,
                        restTime: 60 * 5,
                    };
                case "SEND_EMAIL_REJECTED":
                    return {
                        ...state,
                        sendLoading: false,
                        send: false,
                        realCode: "",
                        restTime: -1,
                    };
                case "TICK":
                    return {
                        ...state,
                        restTime: state.restTime - 1,
                    };
                case "TYPE_CODE":
                    return {
                        ...state,
                        code: action.payload?.code,
                    };
                case "CAN_VERIFY":
                    return {
                        ...state,
                        canVerify: true,
                    };
                case "CAN_NOT_VERIFY":
                    return {
                        ...state,
                        canVerify: false,
                    };
                case "VERIFY_PENDING":
                    return {
                        ...state,
                        verify: false,
                        verifyLoading: true,
                    };
                case "VERIFY_FULFILLED":
                    return {
                        ...state,
                        verify: true,
                        verifyLoading: false,
                        code: "",
                        realCode: "",
                        submitLoading: true,
                    };
                case "VERIFY_REJECTED":
                    return {
                        ...state,
                        verify: false,
                        verifyLoading: false,
                    };
                case "SUBMIT_PENDING":
                    return {
                        ...state,
                        submitLoading: true,
                    };
                case "SUBMIT_FULFILLED":
                    return {
                        ...state,
                        submitLoading: false,
                    };
                case "SUBMIT_REJECTED":
                    return {
                        ...state,
                        submitLoading: false,
                    };
                default:
                    return;
            }
        },
        {
            code: "",
            realCode: "",
            canSend: false,
            send: false,
            sendLoading: false,
            canVerify: false,
            verify: false,
            verifyLoading: false,
            submitLoading: false,
            restTime: -1,
        }
    );
    const timerId = React.useRef(null);

    React.useEffect(() => {
        if (emailVerify.send) {
            timerId.current = setInterval(() => {
                dispatch({
                    type: "TICK",
                });
            }, 1000);
        }

        return () => clearTimeout(timerId.current);
    }, [emailVerify.send]);

    React.useEffect(() => {
        try {
            const resultOfValidateEmail = validateEmail(email);
            if (!resultOfValidateEmail.success) {
                throw resultOfValidateEmail.payload;
            }
            setEmailErrorMessage("");

            const resultOfValidatePassword = validatePassword(password, {
                lower: 1,
                upper: 1,
                numeric: 1,
                special: 1,
                length: [9, Infinity],
            });
            if (!resultOfValidatePassword.success) {
                throw resultOfValidatePassword.payload;
            }
            setPasswordErrorMessage("");

            const resultOfValidatePasswordConfirm = validatePasswordConfirm(
                password,
                passwordConfirm
            );
            if (!resultOfValidatePasswordConfirm.success) {
                throw resultOfValidatePasswordConfirm.payload;
            }
            setPasswordConfirmErrorMessage("");

            return dispatch({
                type: "CAN_SEND_EMAIL",
            });
        } catch (e) {
            switch (e?.message) {
                case "empty email":
                    setEmailErrorMessage("alert.empty_email");
                    break;
                case "invalidate regexp email":
                    setEmailErrorMessage("alert.invalidate_regexp_email");
                    break;
                case "empty password":
                    setPasswordErrorMessage("alert.empty_password");
                    break;
                case "min/max length":
                    setPasswordErrorMessage("alert.min_max_length");
                    break;
                case "lower rule":
                    setPasswordErrorMessage("alert.lower_rule");
                    break;
                case "upper rule":
                    setPasswordErrorMessage("alert.upper_rule");
                    break;
                case "numeric rule":
                    setPasswordErrorMessage("alert.numeric_rule");
                    break;
                case "special rule":
                    setPasswordErrorMessage("alert.special_rule");
                    break;
                case "password confirm fail":
                    setPasswordConfirmErrorMessage(
                        "alert.password_confirm_fail"
                    );
                    break;
                default:
                    break;
            }
            return dispatch({
                type: "CAN_NOT_SEND_EMAIL",
            });
        }
    }, [email, password, passwordConfirm]);

    React.useEffect(() => {
        if (!validateVerifyCode(emailVerify.code).success) {
            return dispatch({
                type: "CAN_NOT_VERIFY",
            });
        }

        dispatch({
            type: "CAN_VERIFY",
        });
    }, [emailVerify.code]);

    const onSendEmailHandler = () => {
        const randomNumberString = generateRandomNumberString(6);

        dispatch({
            type: "SEND_EMAIL_PENDING",
            payload: {
                realCode: randomNumberString,
            },
        });

        _sendVerificationEmail({
            code: randomNumberString,
            email,
        })
            .then(() => {
                dispatch({
                    type: "SEND_EMAIL_FULFILLED",
                });
                toast.success(t("toast.auth.email.signup.bottom_sheet"));
                setOpenBottomSheet(true);
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "SEND_EMAIL_REJECTED",
                });
            });
    };

    const onResendEmailHandler = () => {
        const randomNumberString = generateRandomNumberString(6);

        dispatch({
            type: "SEND_EMAIL_PENDING",
            payload: {
                realCode: randomNumberString,
            },
        });

        _sendVerificationEmail({
            code: randomNumberString,
            email,
        })
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
    };

    const onVerifyHandler = () => {
        dispatch({
            type: "VERIFY_PENDING",
        });

        if (
            emailVerify.code === emailVerify.realCode &&
            Boolean(emailVerify.code) &&
            Boolean(emailVerify.realCode)
        ) {
            dispatch({
                type: "VERIFY_FULFILLED",
            });
            setOpenBottomSheet(false);
            task.run();
            signUp({ type: "email", email, password })
                .then(() => {
                    dispatch({
                        type: "SUBMIT_FULFILLED",
                    });
                    task.finish();
                    navigate.replace({
                        pathname: "/",
                        mode: "main",
                    });
                })
                .catch((e) => {
                    console.dir(e);
                    dispatch({
                        type: "SUBMIT_REJECTED",
                    });
                    task.finish();
                    switch (e?.code) {
                        case "auth/email-already-in-use":
                            toast.error(t("toast.auth/email-already-in-use"));
                            break;
                        default:
                            break;
                    }
                });
        } else {
            toast.error(t("toast.auth.email.signup.verify_rejected"));
            dispatch({
                type: "VERIFY_REJECTED",
            });
        }
    };

    return (
        <>
            <main className="pages-auth-email-signup">
                <div className="container">
                    <p className="welcome-message">
                        <Trans
                            t={t}
                            i18nKey="text.auth.email.signup.welcome_messag"
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
                    <div className="input-fields">
                        <WoilonnInput
                            type="email"
                            label={t("label.auth.email.signin.input_email")}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            alert={t(emailErrorMessage)}
                        />
                        <WoilonnInput
                            type="password"
                            label={t("label.auth.email.signin.input_password")}
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            alert={t(passwordErrorMessage)}
                        />
                        <WoilonnInput
                            type="password"
                            label={t(
                                "label.auth.email.signup.input_password_confirm"
                            )}
                            value={passwordConfirm}
                            onChange={(event) =>
                                setPasswordConfirm(event.target.value)
                            }
                            onKeyPress={(event) => {
                                if (!emailVerify.canSend) return;
                                if (event.key === "Enter") {
                                    onSendEmailHandler();
                                }
                            }}
                            alert={t(passwordConfirmErrorMessage)}
                        />
                    </div>
                    <div className="buttons">
                        <CommonButton
                            className="verify-button"
                            color="primary"
                            onClick={onSendEmailHandler}
                            loading={emailVerify.sendLoading}
                            disabled={!emailVerify.canSend}
                        >
                            {t("btn.signup_submit")}
                        </CommonButton>
                    </div>
                </div>
            </main>
            <BottomSheet
                header={
                    <>
                        <h5>{t("title.bottom_sheet.verify_email")}</h5>
                        <p>{t("text.auth.email.signup.bottom_sheet_header")}</p>
                    </>
                }
                open={openBottomSheet}
                onDismiss={() => {
                    setOpenBottomSheet(false);
                    dispatch({
                        type: "TYPE_CODE",
                        payload: {
                            code: "",
                        },
                    });
                }}
            >
                <div className="bottom-sheet verify-email">
                    <div className="send">
                        <WoilonnInput
                            type="number"
                            label={`${t(`label.verify_code`)} (${t(
                                "label.verify_code_rest_time",
                                { time: displayTime(emailVerify.restTime) }
                            )})`}
                            value={emailVerify.code}
                            onChange={(event) =>
                                dispatch({
                                    type: "TYPE_CODE",
                                    payload: {
                                        code: event.target.value,
                                    },
                                })
                            }
                            onKeyPress={(event) => {
                                if (
                                    !emailVerify.canVerify ||
                                    emailVerify.restTime < 0
                                )
                                    return;
                                if (event.key === "Enter") {
                                    onVerifyHandler();
                                }
                            }}
                        />
                        <CommonButton
                            className="resend-button"
                            color="primary"
                            loading={emailVerify.sendLoading}
                            onClick={onResendEmailHandler}
                        >
                            {t("btn.resend")}
                        </CommonButton>
                    </div>
                    <CommonButton
                        className="verify-button"
                        color="primary"
                        loading={
                            emailVerify.verifyLoading ||
                            emailVerify.submitLoading
                        }
                        disabled={
                            !emailVerify.canVerify || emailVerify.restTime < 0
                        }
                        onClick={onVerifyHandler}
                    >
                        {t("btn.verify_complete")}
                    </CommonButton>
                </div>
            </BottomSheet>
        </>
    );
};

export default EmailSignup;

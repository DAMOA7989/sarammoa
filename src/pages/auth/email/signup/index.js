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

const EmailSignup = () => {
    const { t } = useTranslation();
    const { signUp } = useAuthContext();
    const navigate = useNavigateContext();
    const { task } = useStatusContext();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
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
                    };
                case "SEND_EMAIL_FULFILLED":
                    return {
                        ...state,
                        sendLoading: false,
                        send: true,
                    };
                case "SEND_EMAIL_REJECTED":
                    return {
                        ...state,
                        sendLoading: false,
                        send: false,
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
            canSend: false,
            send: false,
            sendLoading: false,
            canVerify: false,
            verify: false,
            verifyLoading: false,
            submitLoading: false,
        }
    );

    React.useEffect(() => {
        if (!validateEmail(email).success) {
            return dispatch({
                type: "CAN_NOT_SEND_EMAIL",
            });
        }
        if (
            !validatePassword(password, {
                lower: 1,
                upper: 1,
                numeric: 1,
                special: 1,
                length: [9, Infinity],
            }).success
        ) {
            return dispatch({
                type: "CAN_NOT_SEND_EMAIL",
            });
        }
        if (!validatePasswordConfirm(password, passwordConfirm).success) {
            return dispatch({
                type: "CAN_NOT_SEND_EMAIL",
            });
        }

        return dispatch({
            type: "CAN_SEND_EMAIL",
        });
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
        dispatch({
            type: "SEND_EMAIL_PENDING",
        });

        setTimeout(() => {
            dispatch({
                type: "SEND_EMAIL_FULFILLED",
            });
            setOpenBottomSheet(true);
        }, 1000);
    };

    const onResendEmailHandler = () => {
        dispatch({
            type: "SEND_EMAIL_PENDING",
        });

        setTimeout(() => {
            dispatch({
                type: "SEND_EMAIL_FULFILLED",
            });
        }, 1000);
    };

    const onVerifyHandler = () => {
        dispatch({
            type: "VERIFY_PENDING",
        });

        // verify success
        setTimeout(() => {
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
        }, 2000);

        // verify error
        // dispatch({
        //     type: "VERIFY_REJECTED",
        // });
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
                        />
                        <WoilonnInput
                            type="password"
                            label={t("label.auth.email.signin.input_password")}
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
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
                header={t("title.bottom_sheet.verify_email")}
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
                            label={t(`label.verify_code`)}
                            value={emailVerify.code}
                            onChange={(event) =>
                                dispatch({
                                    type: "TYPE_CODE",
                                    payload: {
                                        code: event.target.value,
                                    },
                                })
                            }
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
                        disabled={!emailVerify.canVerify}
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

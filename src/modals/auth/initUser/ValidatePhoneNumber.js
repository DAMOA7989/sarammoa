import React from "react";
import { useTranslation, Trans } from "react-i18next";
import WoilonnInput from "components/input/WoilonnInput";
import CommonButton from "components/button/CommonButton";
import theme from "styles/include.scss";
import { validatePhoneNumber, validateVerifyCode } from "utils/validator";
import {
    _sendVerificationSms,
    _confirmVerificationCode,
    _setUserInfo,
} from "utils/firebase/auth";
import { toast } from "react-toastify";
import { useModalContext } from "utils/modal";
import { CircularProgress } from "@mui/material";
import { useAuthContext } from "utils/auth";

const ValidatePhoneNumber = ({ uid, _idx, screenIdx, setScreenIdx }) => {
    const { t } = useTranslation();
    const { dismissModal } = useModalContext();
    const { signOut } = useAuthContext();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_PHONE_NUMBER":
                    return {
                        ...state,
                        phoneNumber: action.payload?.value,
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
                case "SEND_PENDING":
                    return {
                        ...state,
                        sendLoading: true,
                        send: false,
                        sendId: "",
                    };
                case "SEND_FULFILLED":
                    return {
                        ...state,
                        sendLoading: false,
                        send: true,
                        sendId: action?.payload?.requestId,
                    };
                case "SEND_REJECTED":
                    return {
                        ...state,
                        sendLoading: false,
                        send: false,
                        sendId: "",
                    };
                case "SET_VERIFICATION_CODE":
                    return {
                        ...state,
                        verificationCode: action.payload?.value,
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
                        confirmLoading: true,
                        confirm: false,
                    };
                case "CONFIRM_FULFILLED":
                    return {
                        ...state,
                        confirmLoading: false,
                        confirm: true,
                        canSubmit: true,
                    };
                case "CONFIRM_REJECTED":
                    return {
                        ...state,
                        confirmLoading: false,
                        confirm: false,
                    };
                case "SUBMIT_PENDING":
                    return {
                        ...state,
                        submitLoading: true,
                        submit: false,
                    };
                case "SUBMIT_FULFILLED":
                    return {
                        ...state,
                        submitLoading: false,
                        submit: true,
                    };
                case "SUBMIT_REJECTED":
                    return {
                        ...state,
                        submitLoading: false,
                        submit: false,
                    };
            }
        },
        {
            phoneNumber: "",
            verificationCode: "",
            canSend: false,
            send: false,
            sendLoading: false,
            sendId: "",
            canConfirm: false,
            confirm: false,
            confirmLoading: false,
            canSubmit: false,
            submit: false,
            submitLoading: false,
        }
    );

    React.useEffect(() => {
        try {
            let phoneNumber = state.phoneNumber;

            const resultOfValidatePhoneNumber =
                validatePhoneNumber(phoneNumber);
            if (!resultOfValidatePhoneNumber.success) {
                throw new Error();
            }

            dispatch({
                type: "CAN_SEND",
            });
        } catch (e) {
            dispatch({
                type: "CAN_NOT_SEND",
            });
        }
    }, [state.phoneNumber]);

    React.useEffect(() => {
        if (!state.send) {
            return dispatch({
                type: "CAN_NOT_CONFIRM",
            });
        }

        const resultOfVerificationCode = validateVerifyCode(
            state.verificationCode
        );
        if (!resultOfVerificationCode.success) {
            return dispatch({
                type: "CAN_NOT_CONFIRM",
            });
        }

        dispatch({
            type: "CAN_CONFIRM",
        });
    }, [state.verificationCode]);

    const onSendHandler = () => {
        dispatch({
            type: "SEND_PENDING",
        });

        _sendVerificationSms({ to: state.phoneNumber })
            .then(({ requestId, requestTime, statusCode, statusName }) => {
                toast.success(t("toast.sms.success.send_verification_code"));
                dispatch({
                    type: "SEND_FULFILLED",
                    payload: {
                        requestId,
                    },
                });
            })
            .catch((e) => {
                console.dir(e);
                toast.error(t("toast.sms.error.send_verification_code"));
                dispatch({
                    type: "SEND_REJECTED",
                });
            });
    };

    const onConfirmHandler = () => {
        dispatch({
            type: "CONFIRM_PENDING",
        });

        _confirmVerificationCode({
            vid: "sms:" + state.sendId,
            code: state.verificationCode,
        })
            .then(() => {
                toast.success(t("toast.sms.success.confirm_verification_code"));
                dispatch({
                    type: "CONFIRM_FULFILLED",
                });
            })
            .catch((e) => {
                console.dir(e);
                toast.error(t("toast.sms.error.confirm_verification_code"));
                dispatch({
                    type: "CONFIRM_REJECTED",
                });
            });
    };

    const onSubmitHandler = () => {
        dispatch({
            type: "SUBMIT_PENDING",
        });

        _setUserInfo({
            uid,
            payload: {
                phoneNumber: state.phoneNumber,
                init: true,
            },
        })
            .then(() => {
                // toast.success(t(""));
                dispatch({
                    type: "SUBMIT_FULFILLED",
                });
                dismissModal();
            })
            .catch((e) => {
                console.dir(e);
                // toast.error(t(""));
                dispatch({
                    type: "SUBMIT_REJECTED",
                });
            });
    };

    return (
        <div className="modals-auth-init-user-validate-phone-number">
            {state.submitLoading ? (
                <CircularProgress color="primary" size={45} />
            ) : (
                <>
                    <CommonButton
                        className="sign-out-button"
                        type="text"
                        color="primary"
                        onClick={() => signOut().then(dismissModal)}
                    >
                        {t("text.setup.sign_out")}
                    </CommonButton>
                    <div className="container">
                        <h1 className="title">
                            <Trans
                                t={t}
                                i18nKey="title.modal.init_user.agreement"
                                components={{
                                    appName: (
                                        <span
                                            style={{
                                                color: theme?.primaryColor,
                                                fontSize: "1.25rem",
                                                fontWeight: "bold",
                                            }}
                                        />
                                    ),
                                    small: (
                                        <span
                                            style={{
                                                fontSize: "1rem",
                                            }}
                                        />
                                    ),
                                }}
                            />
                        </h1>
                        <div className="content">
                            <div className="phone-number">
                                <WoilonnInput
                                    type="tel"
                                    className="input-field"
                                    placeholder={"010-0000-0000"}
                                    label={t("label.phone_number")}
                                    value={state.phoneNumber}
                                    disabled={state.send}
                                    onChange={(value) => {
                                        dispatch({
                                            type: "SET_PHONE_NUMBER",
                                            payload: {
                                                value,
                                            },
                                        });
                                    }}
                                />
                                <CommonButton
                                    color="primary"
                                    disabled={!state.canSend || state.send}
                                    loading={state.sendLoading}
                                    onClick={onSendHandler}
                                >
                                    {t("btn.get_verification_code")}
                                </CommonButton>
                            </div>
                            <div className="verification-code">
                                <WoilonnInput
                                    className="input-field"
                                    label={t("label.verify_code")}
                                    value={state.verificationCode}
                                    disabled={!state.send || state.confirm}
                                    onChange={(event) =>
                                        dispatch({
                                            type: "SET_VERIFICATION_CODE",
                                            payload: {
                                                value: event.target.value,
                                            },
                                        })
                                    }
                                />
                                <CommonButton
                                    color="primary"
                                    disabled={
                                        !state.canConfirm || state.confirm
                                    }
                                    loading={state.confirmLoading}
                                    onClick={onConfirmHandler}
                                >
                                    {t("btn.confirm")}
                                </CommonButton>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <CommonButton
                className="submit-button"
                color="primary"
                disabled={!state.canSubmit}
                loading={state.submitLoading}
                onClick={onSubmitHandler}
            >
                {t("btn.start")}
            </CommonButton>
        </div>
    );
};

export default ValidatePhoneNumber;

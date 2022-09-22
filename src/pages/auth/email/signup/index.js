import React from "react";
import { useTranslation, Trans } from "react-i18next";
import WoilonnInput from "components/input/WoilonnInput";
import CommonButton from "components/button/CommonButton";
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirm,
} from "utils/validator";
import { useAuthContext } from "utils/auth";
import { useNavigateContext } from "utils/navigate";
import { toast } from "react-toastify";

const EmailSignup = () => {
    const { t } = useTranslation();
    const { signUp } = useAuthContext();
    const navigate = useNavigateContext();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useEffect(() => {
        if (!validateEmail(email).success) {
            return setCanSubmit(false);
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
            return setCanSubmit(false);
        }
        if (!validatePasswordConfirm(password, passwordConfirm).success) {
            return setCanSubmit(false);
        }

        return setCanSubmit(true);
    }, [email, password, passwordConfirm]);

    const onSubmitHandler = () => {
        setIsLoading(true);
        signUp({ type: "email", email, password })
            .then(() => {
                setIsLoading(false);
                navigate.replace({
                    pathname: "/",
                    mode: "main",
                });
            })
            .catch((e) => {
                console.dir(e);
                switch (e?.code) {
                    case "auth/email-already-in-use":
                        toast.error(t("toast.auth/email-already-in-use"));
                        break;
                    default:
                        break;
                }
                setIsLoading(false);
            });
    };

    return (
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
                        onChange={(event) => setPassword(event.target.value)}
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
                        className="submit-button"
                        color="primary"
                        loading={isLoading}
                        onClick={onSubmitHandler}
                        disabled={!canSubmit}
                    >
                        {t("btn.signup_submit")}
                    </CommonButton>
                </div>
            </div>
        </main>
    );
};

export default EmailSignup;

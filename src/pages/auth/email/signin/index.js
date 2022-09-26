import React from "react";
import { Trans, useTranslation } from "react-i18next";
import WoilonnInput from "components/input/WoilonnInput";
import CommonButton from "components/button/CommonButton";
import { useAuthContext } from "utils/auth";
import { validateEmail, validatePassword } from "utils/validator";
import { useNavigateContext } from "utils/navigate";

const EmailSignin = () => {
    const { t } = useTranslation();
    const auth = useAuthContext();
    const navigate = useNavigateContext();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useEffect(() => {
        if (
            !validateEmail(email).success ||
            !validatePassword(password, {
                lower: 1,
                upper: 1,
                numeric: 1,
                special: 1,
                length: [9, Infinity],
            }).success
        ) {
            return setCanSubmit(false);
        } else {
            return setCanSubmit(true);
        }
    }, [email, password]);

    const onSubmitHandler = () => {
        setIsLoading(true);

        auth.signIn({
            type: "email",
            payload: {
                email,
                password,
            },
        })
            .then((result) => {
                navigate.replace({
                    pathname: "/",
                    mode: "main",
                });
                setIsLoading(false);
            })
            .catch((e) => {
                console.dir(e);
                switch (e.code) {
                    case "auth/wrong-password":
                        break;
                    default:
                        break;
                }
                setIsLoading(false);
            });
    };

    return (
        <main className="pages-auth-email-signin">
            <div className="container">
                <p className="welcome-message">
                    <Trans
                        t={t}
                        i18nKey="text.auth.email.signin.welcome_message"
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
                        onKeyPress={(event) => {
                            if (!canSubmit) return;
                            if (event.key === "Enter") {
                                onSubmitHandler();
                            }
                        }}
                    />
                </div>
                <div className="buttons">
                    <CommonButton
                        className="start-button"
                        color="primary"
                        loading={isLoading}
                        onClick={onSubmitHandler}
                        disabled={!canSubmit}
                    >
                        {t("btn.start")}
                    </CommonButton>
                    <div className="redirects">
                        <CommonButton
                            className="forget-password-button"
                            type="text"
                            color="primary"
                            disabled={false}
                            onClick={() => {
                                navigate.push({
                                    pathname: "/auth/email/find",
                                    mode: "main",
                                    screenTitle: "title.auth.email.find",
                                });
                            }}
                        >
                            {t("btn.forget_password")}
                        </CommonButton>
                        <CommonButton
                            className="signup-button"
                            type="text"
                            color="black"
                            disabled={false}
                            onClick={() => {
                                navigate.push({
                                    pathname: "/auth/email/signup",
                                    mode: "main",
                                    screenTitle: "title.auth.email.signup",
                                });
                            }}
                        >
                            {t("btn.signup")}
                        </CommonButton>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EmailSignin;

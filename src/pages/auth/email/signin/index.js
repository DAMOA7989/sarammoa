import React from "react";
import { Trans, useTranslation } from "react-i18next";
import WoilonnInput from "components/input/WoilonnInput";
import CommonButton from "components/button/CommonButton";
import { useAuthContext } from "utils/auth";

const EmailSignin = () => {
    const { t } = useTranslation();
    const { signIn } = useAuthContext();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useEffect(() => {
        if (!Boolean(email) || !Boolean(password)) {
            return setCanSubmit(false);
        } else {
            return setCanSubmit(true);
        }
    }, [email, password]);

    const onSubmitHandler = () => {
        setIsLoading(true);

        setIsLoading(false);
    };

    return (
        <main className="pages-auth-email-signin">
            <p className="welcome-message">
                <Trans
                    t={t}
                    i18nKey="text.auth.email.signin.welcome_message"
                    components={{
                        big: (
                            <span
                                style={{ fontSize: "32px", fontWeight: 700 }}
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
            </div>
            <div className="buttons">
                <CommonButton
                    color="primary"
                    loading={isLoading}
                    onClick={onSubmitHandler}
                    disabled={!canSubmit}
                >
                    {t("btn.start")}
                </CommonButton>
                <div className="redirects">
                    <CommonButton type="text" color="primary" disabled={false}>
                        {t("btn.forget_password")}
                    </CommonButton>
                    <CommonButton type="text" color="white" disabled={false}>
                        {t("btn.signup")}
                    </CommonButton>
                </div>
            </div>
        </main>
    );
};

export default EmailSignin;

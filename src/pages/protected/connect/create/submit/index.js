import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import { useOutletContext } from "react-router-dom";

const ConnectCreateSubmit = () => {
    const { t } = useTranslation();
    const { screenIdx, setScreenIdx } = useOutletContext();
    const navigate = useNavigateContext();
    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useLayoutEffect(() => {
        navigate.setLayout({
            right: {
                submit: {
                    title: t("btn.submit"),
                    onClick: onSubmitHandler,
                    disabled: !canSubmit,
                },
            },
            goBack: {
                onClick: () => {
                    setScreenIdx(screenIdx - 1);
                },
            },
        });
    }, []);

    const onSubmitHandler = () => {
        console.log("d submit");
    };

    return <main className="protected-connect-create-submit">submit</main>;
};

export default ConnectCreateSubmit;

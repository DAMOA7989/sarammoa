import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";

const ConnectCreateSubmit = ({ _idx, screenIdx, setScreenIdx }) => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useLayoutEffect(() => {
        if (screenIdx === _idx) {
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
        }
    }, [screenIdx, canSubmit]);

    const onSubmitHandler = () => {};

    return <main className="protected-connect-create-submit">submit</main>;
};

export default ConnectCreateSubmit;

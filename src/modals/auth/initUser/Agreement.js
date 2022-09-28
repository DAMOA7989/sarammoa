import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { ReactComponent as ArrowBottomDoubleIcon } from "assets/images/icons/arrow_bottom_double.svg";
import theme from "styles/include.scss";
import WoilonnCheckbox from "components/input/WoilonnCheckbox";

const Agreement = ({ _idx, screenIdx, setScreenIdx }) => {
    const { t } = useTranslation();

    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "CHECK_ENTIRE":
                    return {
                        ...state,
                        checkedEntire: true,
                        checkedPrivacyPolicy: true,
                        checkedTermsOfUse: true,
                        checkedMarketingInfo: true,
                        checkedUpperAge: true,
                    };
                case "UNCHECK_ENTIRE":
                    return {
                        ...state,
                        checkedEntire: false,
                        checkedPrivacyPolicy: false,
                        checkedTermsOfUse: false,
                        checkedMarketingInfo: false,
                        checkedUpperAge: false,
                    };
                case "CHECK_PRIVACY_POLICY":
                    return {
                        ...state,
                        checkedPrivacyPolicy: true,
                    };
                case "UNCHECK_PRIVACY_POLICY":
                    return {
                        ...state,
                        checkedEntire: false,
                        checkedPrivacyPolicy: false,
                    };
                case "CHECK_TERMS_OF_USE":
                    return {
                        ...state,
                        checkedTermsOfUse: true,
                    };
                case "UNCHECK_TERMS_OF_USE":
                    return {
                        ...state,
                        checkedEntire: false,
                        checkedTermsOfUse: false,
                    };
                case "CHECK_MARKETING_INFO":
                    return {
                        ...state,
                        checkedMarketingInfo: true,
                    };
                case "UNCHECK_MARKETING_INFO":
                    return {
                        ...state,
                        checkedEntire: false,
                        checkedMarketingInfo: false,
                    };
                case "CHECK_UPPER_AGE":
                    return {
                        ...state,
                        checkedUpperAge: true,
                    };
                case "UNCHECK_UPPER_AGE":
                    return {
                        ...state,
                        checkedEntire: false,
                        checkedUpperAge: false,
                    };
            }
        },
        {
            checkedEntire: false,
            checkedPrivacyPolicy: false,
            checkedTermsOfUse: false,
            checkedMarketingInfo: false,
            checkedUpperAge: false,
        }
    );

    return (
        <div className="modals-auth-init-user-agreement">
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
                    <WoilonnCheckbox
                        type="fill"
                        label={t("label.checkbox.entire")}
                        labelStyle={{
                            fontSize: "1rem",
                        }}
                        checked={state.checkedEntire}
                        onClick={(checked) => {
                            switch (checked) {
                                case true:
                                    dispatch({
                                        type: "UNCHECK_ENTIRE",
                                    });
                                    break;
                                case false:
                                    dispatch({
                                        type: "CHECK_ENTIRE",
                                    });
                                    break;
                            }
                        }}
                    />
                    <div className="divider" />
                    <WoilonnCheckbox
                        className="common-checkbox"
                        label={t("label.checkbox.privacy_policy")}
                        required={true}
                        checked={state.checkedPrivacyPolicy}
                        onClick={(checked) => {
                            switch (checked) {
                                case true:
                                    dispatch({
                                        type: "UNCHECK_PRIVACY_POLICY",
                                    });
                                    break;
                                case false:
                                    dispatch({
                                        type: "CHECK_PRIVACY_POLICY",
                                    });
                                    break;
                            }
                        }}
                    />
                    <WoilonnCheckbox
                        className="common-checkbox"
                        label={t("label.checkbox.terms_of_use")}
                        required={true}
                        checked={state.checkedTermsOfUse}
                        onClick={(checked) => {
                            switch (checked) {
                                case true:
                                    dispatch({
                                        type: "UNCHECK_TERMS_OF_USE",
                                    });
                                    break;
                                case false:
                                    dispatch({
                                        type: "CHECK_TERMS_OF_USE",
                                    });
                                    break;
                            }
                        }}
                    />
                    <WoilonnCheckbox
                        className="common-checkbox"
                        label={t("label.checkbox.marketing_info")}
                        required={false}
                        checked={state.checkedMarketingInfo}
                        onClick={(checked) => {
                            switch (checked) {
                                case true:
                                    dispatch({
                                        type: "UNCHECK_MARKETING_INFO",
                                    });
                                    break;
                                case false:
                                    dispatch({
                                        type: "CHECK_MARKETING_INFO",
                                    });
                                    break;
                            }
                        }}
                    />
                    <WoilonnCheckbox
                        className="common-checkbox"
                        label={t("label.checkbox.upper_age")}
                        required={true}
                        checked={state.checkedUpperAge}
                        onClick={(checked) => {
                            switch (checked) {
                                case true:
                                    dispatch({
                                        type: "UNCHECK_UPPER_AGE",
                                    });
                                    break;
                                case false:
                                    dispatch({
                                        type: "CHECK_UPPER_AGE",
                                    });
                                    break;
                            }
                        }}
                    />
                </div>
            </div>

            {state.checkedPrivacyPolicy &&
                state.checkedTermsOfUse &&
                state.checkedUpperAge && (
                    <ArrowBottomDoubleIcon
                        className="arrow-bottom-double-icon"
                        onClick={() => setScreenIdx(2)}
                        style={{
                            display: _idx === screenIdx ? "block" : "none",
                        }}
                    />
                )}
        </div>
    );
};

export default Agreement;

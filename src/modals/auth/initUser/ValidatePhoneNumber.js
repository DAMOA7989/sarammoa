import React from "react";
import { useTranslation } from "react-i18next";

const ValidatePhoneNumber = ({ _idx, screenIdx, setScreenIdx }) => {
    const { t } = useTranslation();

    return (
        <div className="modals-auth-init-user-validate-phone-number">
            validate phone number
        </div>
    );
};

export default ValidatePhoneNumber;

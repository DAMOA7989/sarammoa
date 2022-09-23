import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";

const SubHeader = () => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();

    return (
        <header className="components-header-sub-header">
            <div className="container">
                <div
                    className="go-back-icon"
                    onClick={() => navigate.goBack()}
                ></div>
                <h3 className="title">{t(navigate.state.screenTitle)}</h3>
            </div>
        </header>
    );
};

export default SubHeader;

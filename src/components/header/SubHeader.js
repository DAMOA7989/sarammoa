import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";

const SubHeader = () => {
    const { t } = useTranslation();
    const { goBack, screenTitle } = useNavigateContext();
    const navigate = useNavigate();

    return (
        <header className="components-header-sub-header">
            <div className="container">
                <div
                    className="go-back-icon"
                    onClick={() => navigate(-1)}
                ></div>
                <h3 className="title">{t(screenTitle)}</h3>
            </div>
        </header>
    );
};

export default SubHeader;

import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import CommonButton from "components/button/CommonButton";

const SubHeader = () => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();

    return (
        <header className="components-header-sub-header">
            <div className="container">
                <section className="left">
                    <div
                        className="go-back-icon"
                        onClick={() => navigate.goBack()}
                    ></div>
                    <h3 className="title">{t(navigate.state.screenTitle)}</h3>
                </section>
                <section className="right">
                    <ul>
                        {Object.values(navigate.state.right || {}).map(
                            (it, idx) => (
                                <li key={idx}>
                                    <CommonButton
                                        type="text"
                                        onClick={it.onClick}
                                        disabled={it.disabled}
                                    >
                                        {it.title || it.icon}
                                    </CommonButton>
                                </li>
                            )
                        )}
                    </ul>
                </section>
            </div>
        </header>
    );
};

export default React.memo(SubHeader);

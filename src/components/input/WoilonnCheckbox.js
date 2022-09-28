import React from "react";
import { ReactComponent as CheckmarkIcon } from "assets/images/icons/checkmark.svg";
import { ReactComponent as CheckmarkFillIcon } from "assets/images/icons/checkmark_fill.svg";
import { useTranslation } from "react-i18next";

const WoilonnCheckbox = ({
    className,
    type,
    label,
    labelStyle,
    checked,
    onClick,
    required,
}) => {
    const { t } = useTranslation();

    return (
        <div className={`woilonn-checkbox ${className}`}>
            <div
                className={`checkmark ${type || "common"} ${
                    checked ? "checked" : "unchecked"
                }`}
                checked={checked}
                onClick={() => {
                    onClick(checked);
                }}
            >
                {type === "common" || (!type && <CheckmarkIcon />)}
                {type === "fill" && <CheckmarkFillIcon />}
            </div>
            <div
                className="label"
                style={{
                    ...labelStyle,
                }}
            >
                {label}
            </div>
            {typeof required === "boolean" && (
                <div className="required">
                    {`(${
                        required
                            ? t("text.checkbox.required.true")
                            : t("text.checkbox.required.false")
                    })`}
                </div>
            )}
        </div>
    );
};

export default WoilonnCheckbox;

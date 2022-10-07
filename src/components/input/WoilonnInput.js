import React from "react";
import PhoneInput from "react-phone-number-input";
import { ReactComponent as RequiredIcon } from "assets/images/icons/component/required.svg";

const WoilonnInput = ({
    className,
    label,
    type,
    placeholder,
    value,
    onChange,
    onKeyPress,
    disabled,
    alert,
    required,
}) => {
    return (
        <div className={`woilonn-input ${className}`}>
            {Boolean(label) && (
                <div className={`label ${required && "required"}`}>
                    {label}
                    {required && <RequiredIcon />}
                </div>
            )}
            <div className="input-container">
                {type === "tel" ? (
                    <PhoneInput
                        defaultCountry="KR"
                        placeholder={placeholder || null}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                ) : (
                    <input
                        type={type || "text"}
                        placeholder={placeholder || null}
                        value={value}
                        onChange={onChange}
                        onKeyPress={onKeyPress}
                        disabled={disabled}
                    />
                )}
            </div>
            {Boolean(alert) && <div className="alert">{alert}</div>}
        </div>
    );
};

export default WoilonnInput;

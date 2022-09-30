import React from "react";
import PhoneInput from "react-phone-number-input";

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
}) => {
    return (
        <div className={`woilonn-input ${className}`}>
            <div className="label">{label}</div>
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

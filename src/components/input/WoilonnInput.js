import React from "react";

const WoilonnInput = ({
    label,
    type,
    placeholder,
    value,
    onChange,
    onKeyPress,
}) => {
    return (
        <div className="woilonn-input">
            <div className="label">{label}</div>
            <div className="input-container">
                <input
                    type={type || "text"}
                    placeholder={placeholder || null}
                    value={value}
                    onChange={onChange}
                    onKeyPress={onKeyPress}
                />
            </div>
        </div>
    );
};

export default WoilonnInput;

import React from "react";

const WoilonnInput = ({ label, type, placeholder, value, onChange }) => {
    return (
        <div className="woilonn-input">
            <div className="label">{label}</div>
            <div className="input-container">
                <input
                    type={type || "text"}
                    placeholder={placeholder || null}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default WoilonnInput;

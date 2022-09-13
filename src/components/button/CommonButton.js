import React from "react";

const CommonButton = ({ children, color, className, onClick, disabled }) => {
    return (
        <button
            className={`common-button ${color} ${
                !disabled && "active"
            } ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default CommonButton;

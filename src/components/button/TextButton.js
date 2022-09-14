import React from "react";
import { CircularProgress } from "@mui/material";

const TextButton = ({
    children,
    color,
    className,
    onClick,
    disabled,
    loading,
}) => {
    return (
        <button
            className={`text-button ${color} ${
                !disabled && "active"
            } ${className}`}
            onClick={disabled ? null : onClick}
        >
            {loading ? <CircularProgress color="black" size={20} /> : children}
        </button>
    );
};

export default TextButton;

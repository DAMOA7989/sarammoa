import React from "react";
import { CircularProgress } from "@mui/material";

const CommonButton = ({
    children,
    color,
    className,
    onClick,
    disabled,
    isLoading,
}) => {
    return (
        <button
            className={`common-button ${color} ${
                !disabled && "active"
            } ${className}`}
            onClick={onClick}
        >
            {isLoading ? (
                <CircularProgress color="black" size={20} />
            ) : (
                children
            )}
        </button>
    );
};

export default CommonButton;

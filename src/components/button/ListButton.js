import React from "react";

const ListButton = ({ className, onClick, children }) => {
    return (
        <div className={`list-button ${className}`} onClick={onClick}>
            {children}
        </div>
    );
};

export default ListButton;

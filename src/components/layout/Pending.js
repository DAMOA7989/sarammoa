import React from "react";
import reactDom from "react-dom";
import { CircularProgress } from "@mui/material";
import { useStatusContext } from "utils/status";

const Pending = () => {
    const { task } = useStatusContext();

    const el = window.document.getElementById("pending");
    if (!task.status) {
        return reactDom.createPortal(null, el);
    }
    return reactDom.createPortal(
        <div className="pending-container">
            <CircularProgress color="primary" size={45} />
        </div>,
        el
    );
};

export default Pending;

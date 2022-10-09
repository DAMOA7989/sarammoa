import React from "react";
import { Skeleton } from "@mui/material";

const LazyTypography = ({ children, fontSize, width }) => {
    if (Boolean(children)) {
        return children;
    }

    return (
        <Skeleton
            variant="text"
            sx={{ fontSize }}
            width={width}
            animation="wave"
        />
    );
};

export default LazyTypography;

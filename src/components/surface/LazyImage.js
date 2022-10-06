import React from "react";
import { Skeleton } from "@mui/material";

const LazyImage = ({ src, alt, width, height }) => {
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        if (!Boolean(src)) return;
        const newImg = new Image();
        newImg.src = src;
        newImg.onload = () => {
            setLoaded(true);
        };
    }, [src]);

    return (
        <div className="lazy-image">
            {loaded ? (
                <img src={src} alt={alt} />
            ) : (
                <Skeleton variant="rectangular" animation="wave" />
            )}
        </div>
    );
};

export default LazyImage;

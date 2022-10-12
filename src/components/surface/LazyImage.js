import React from "react";
import { Skeleton } from "@mui/material";

const LazyImage = ({ src, alt, width, height, position }) => {
    const [loaded, setLoaded] = React.useState(false);
    const lazyImageRef = React.useRef(null);

    React.useEffect(() => {
        if (!Boolean(src)) return;
        const newImg = new Image();
        newImg.src = src;
        newImg.onload = () => {
            setLoaded(true);
        };
    }, [src]);

    return (
        <div ref={lazyImageRef} className={`lazy-image position-${position}`}>
            {loaded ? (
                <img src={src} alt={alt} />
            ) : (
                <Skeleton variant="rectangular" animation="wave" />
            )}
        </div>
    );
};

export default LazyImage;

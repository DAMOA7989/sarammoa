import React from "react";
import LazyImage from "./LazyImage";
import { Skeleton } from "@mui/material";

const IdCard = ({ className, size, userInfo }) => {
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        if (!Boolean(userInfo?.profileThumbnailUrl)) {
            return setLoaded(false);
        }

        if (!Boolean(userInfo?.nickname)) {
            return setLoaded(false);
        }

        setLoaded(true);
    }, [userInfo]);

    return (
        <div className={`id-card ${className} ${size}`}>
            <div className="profile-thumbnail">
                <LazyImage
                    src={userInfo?.profileThumbnailUrl}
                    alt="profile thumbnail"
                />
            </div>

            <div className="nickname">
                {loaded ? (
                    userInfo?.nickname
                ) : (
                    <Skeleton
                        className="skeleton"
                        variant="text"
                        animation="wave"
                    />
                )}
            </div>
        </div>
    );
};

export default IdCard;

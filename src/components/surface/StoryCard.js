import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as CameraIcon } from "assets/images/icons/camera.svg";
import { Skeleton } from "@mui/material";

const StoryCard = ({ type, className, writer }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = React.useState(false);

    const imgRef = React.useRef(null);

    React.useEffect(() => {
        const newImg = new Image();
        newImg.src = writer?.profileThumbnailUrl;
        newImg.onload = () => {
            setLoaded(true);
        };
    }, []);

    return (
        <article className={`story-card ${className}`}>
            <div className="profile-thumbnail-outline">
                <div className={`profile-thumbnail ${type}`}>
                    {type === "add" ? (
                        <CameraIcon />
                    ) : loaded ? (
                        <img
                            ref={imgRef}
                            src={writer?.profileThumbnailUrl}
                            alt="profile thumbnail"
                        />
                    ) : (
                        <Skeleton
                            variant="rectangular"
                            width={80}
                            height={80}
                            animation="wave"
                        />
                    )}
                </div>
            </div>
            <div className="nickname">
                {type === "add" ? (
                    `+ ${t("title.add")}`
                ) : loaded ? (
                    writer?.nickname
                ) : (
                    <Skeleton
                        variant="text"
                        width={40}
                        animation="wave"
                        sx={{ fontSize: "0.75rem" }}
                    />
                )}
            </div>
        </article>
    );
};

export default StoryCard;

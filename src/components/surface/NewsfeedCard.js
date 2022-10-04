import React from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@mui/material";

const NewsfeedCard = ({ writer, titleImageSrc, title, content }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        const newImg = new Image();
        newImg.src = titleImageSrc;
        newImg.onload = () => {
            setLoaded(true);
        };
    }, []);

    return (
        <article className="newsfeed-card">
            <header className="writer">
                <div className="profile-thumbnail-outline">
                    <div className="profile-thumbnail">
                        {loaded ? (
                            <img
                                src={writer?.profileThumbnailUrl}
                                alt="writer profile thumbnail"
                            />
                        ) : (
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width={"2.25em"}
                                height={"2.25em"}
                            />
                        )}
                    </div>
                </div>
                <span className="nickname">
                    {loaded ? (
                        writer?.nickname
                    ) : (
                        <Skeleton variant="text" animation="wave" width={100} />
                    )}
                </span>
            </header>
            <div className="title-image">
                {loaded ? (
                    <img src={titleImageSrc} />
                ) : (
                    <Skeleton
                        variant="rectangular"
                        animation="wave"
                        width="100vw"
                        height={`${100 / 1.618}vw`}
                    />
                )}
            </div>
            <div className="container">
                <h5 className="title">
                    {loaded ? (
                        title
                    ) : (
                        <Skeleton
                            variant="text"
                            sx={{
                                fontSize: "1.125rem",
                            }}
                            width={200}
                        />
                    )}
                </h5>
                <p className="content">
                    {loaded ? (
                        content
                    ) : (
                        <>
                            <Skeleton
                                variant="text"
                                sx={{
                                    fontSize: "0.875rem",
                                }}
                            />
                            <Skeleton
                                variant="text"
                                sx={{
                                    fontSize: "0.875rem",
                                }}
                            />
                            <Skeleton
                                variant="text"
                                sx={{
                                    fontSize: "0.875rem",
                                }}
                                width={200}
                            />
                        </>
                    )}
                </p>
            </div>
        </article>
    );
};

export default NewsfeedCard;

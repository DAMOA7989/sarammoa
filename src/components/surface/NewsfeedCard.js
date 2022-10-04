import React from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@mui/material";

const NewsfeedCard = ({ writer, titleImageSrc, title, content }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = React.useState(false);
    const cardRef = React.useRef(null);
    const rippleEffectRef = React.useRef(null);
    const timerRef = React.useRef(null);

    React.useEffect(() => {
        const newImg = new Image();
        newImg.src = titleImageSrc;
        newImg.onload = () => {
            setLoaded(true);
        };
    }, []);

    React.useEffect(() => {
        const eventHandler = (event) => {
            event.preventDefault();
            if (!cardRef.current.contains(event.target)) return;

            const rect = cardRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            rippleEffectRef.current.style.left = `calc(${x}px - 1.75em)`;
            rippleEffectRef.current.style.top = `calc(${y}px - 1.75em)`;

            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
                rippleEffectRef.current.classList.remove("active");
            }

            setTimeout(() => {
                rippleEffectRef.current.classList.add("active");
                timerRef.current = setTimeout(() => {
                    rippleEffectRef.current.classList.remove("active");
                }, 500);
            }, 10);
        };

        cardRef.current.addEventListener("click", eventHandler);

        return () => {
            if (!cardRef.current) return;
            cardRef.current.removeEventListener("click", eventHandler);
        };
    });

    return (
        <article ref={cardRef} className="newsfeed-card">
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
            <div ref={rippleEffectRef} className="ripple-effect" />
        </article>
    );
};

export default NewsfeedCard;

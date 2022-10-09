import React from "react";
import { Skeleton } from "@mui/material";

const ProfileHistoryCard = ({ coverUrl, title, onClick }) => {
    const [loaded, setLoaded] = React.useState(false);
    const cardRef = React.useRef(null);
    const rippleEffectRef = React.useRef(null);
    const timerRef = React.useRef(null);
    const titleImageRef = React.useRef(null);

    React.useEffect(() => {
        const newImg = new Image();
        newImg.src = coverUrl;
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
    }, []);

    return (
        <article
            ref={cardRef}
            className="profile-history-card"
            onClick={onClick}
        >
            <div ref={titleImageRef} className="title-image">
                {loaded ? (
                    <img src={coverUrl} alt="title image" />
                ) : (
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            fontSize: "0.8125em",
                        }}
                        height={180}
                    />
                )}
            </div>
            <div className="title">
                {loaded ? title : <Skeleton variant="text" sx={{}} />}
            </div>
            <div ref={rippleEffectRef} className="ripple-effect" />
        </article>
    );
};

export default ProfileHistoryCard;

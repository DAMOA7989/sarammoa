import React from "react";

const NotificationCard = ({ user: _user, message, date }) => {
    const timerRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const rippleEffectRef = React.useRef(null);

    React.useEffect(() => {
        const eventHandler = (event) => {
            event.preventDefault();
            if (!containerRef.current.contains(event.target)) return;

            const rect = containerRef.current.getBoundingClientRect();
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

        containerRef.current.addEventListener("click", eventHandler);
        return () => {
            if (!containerRef.current) return;
            containerRef.current.removeEventListener("click", eventHandler);
        };
    }, []);

    return (
        <div ref={containerRef} className="notification-card">
            <div className="profile-thumbnail">
                <img
                    src={_user?.profileThumbnailUrl}
                    alt="profile thumbnail"
                    loading="lazy"
                />
            </div>
            <div className="content">
                <div className="message">{message}</div>
            </div>
            <div className="date">{date}</div>
            <div ref={rippleEffectRef} className="ripple-effect" />
        </div>
    );
};

export default NotificationCard;

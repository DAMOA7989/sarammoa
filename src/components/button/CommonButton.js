import React from "react";
import { CircularProgress } from "@mui/material";

const CommonButton = ({
    children,
    color,
    className,
    onClick,
    disabled,
    loading,
    type,
    icon,
}) => {
    const timerRef = React.useRef(null);
    const buttonRef = React.useRef(null);
    const rippleEffectRef = React.useRef(null);

    React.useEffect(() => {
        const eventHandler = (event) => {
            if (!buttonRef.current.contains(event.target)) return;

            const rect = buttonRef.current.getBoundingClientRect();
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

        buttonRef.current.addEventListener("click", eventHandler);

        return () => {
            if (!buttonRef.current) return;
            buttonRef.current.removeEventListener("click", eventHandler);
        };
    }, []);

    return (
        <button
            ref={buttonRef}
            className={`common-button ${type} ${color} ${
                !disabled && "active"
            } ${className}`}
            onClick={disabled ? null : onClick}
        >
            {icon && icon}
            {loading ? <CircularProgress color="black" size={20} /> : children}
            <div ref={rippleEffectRef} className="ripple-effect" />
        </button>
    );
};

export default CommonButton;

import React from "react";

const RippleEffect = ({ children, onClick }) => {
    const timerRef = React.useRef(null);
    const rippleEffectRef = React.useRef(null);
    const containerRef = React.useRef(null);

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
        <div
            ref={containerRef}
            onClick={onClick}
            className="ripple-effect-container"
        >
            {children}
            <div ref={rippleEffectRef} className="ripple-effect" />
        </div>
    );
};

export default RippleEffect;

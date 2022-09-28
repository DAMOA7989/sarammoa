import React from "react";

const ScreenCarousel = ({ screenIdx, setScreenIdx, screens }) => {
    return (
        <div
            className="screen-carousel"
            style={{
                transform: `translateY(calc(${-100 * screenIdx}%))`,
            }}
        >
            {(screens || []).map((screen, idx) => (
                <div
                    className="screen"
                    key={idx}
                    style={{
                        opacity: screenIdx === idx ? "1" : "0",
                    }}
                >
                    {React.cloneElement(
                        screen,
                        {
                            screenIdx,
                            setScreenIdx,
                        },
                        null
                    )}
                </div>
            ))}
        </div>
    );
};

export default ScreenCarousel;

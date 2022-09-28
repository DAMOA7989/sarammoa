import React from "react";
import cx from "classnames";

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
                    className={`screen ${
                        screenIdx === idx ? "active" : "inactive"
                    }`}
                    key={idx}
                    style={{
                        opacity: screenIdx === idx ? "1" : "0",
                    }}
                >
                    {React.cloneElement(
                        screen,
                        {
                            _idx: idx,
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

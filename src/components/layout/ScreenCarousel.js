import React from "react";

const ScreenCarousel = ({ mode, screenIdx, setScreenIdx, screens }) => {
    const styles = {};
    if (!Boolean(mode) || mode === "main") {
        styles.transform = `translateY(calc(${
            -(100 / screens.length) * screenIdx
        }%))`;
        styles.height = `${100 * screens.length}%`;
    }
    if (mode === "sub") {
        styles.transform = `translateX(calc(${
            -(100 / screens.length) * screenIdx
        }%))`;
        styles.width = `${100 * screens.length}vw`;
    }

    return (
        <div className={`screen-carousel ${mode || "main"}`} style={styles}>
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

export default React.memo(ScreenCarousel);

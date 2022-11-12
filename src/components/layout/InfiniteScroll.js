import React from "react";

const InfiniteScroll = ({ children, page, setPage }) => {
    const screenEndRef = React.useRef(null);
    const observerRef = React.useRef(
        new IntersectionObserver((entries, observer) => {
            if (entries?.[0].intersectionRatio === 1) {
                console.log("d entries", entries);
                setTimeout(() => setPage(page + 1), 2000);
            }
        }, {})
    );

    React.useEffect(() => {
        observerRef.current.observe(screenEndRef.current);
        // return () => observerRef.current.unobserve(screenEndRef.current);
    }, []);

    return (
        <div className="infinite-scroll">
            {children}
            <div ref={screenEndRef} />
        </div>
    );
};

export default InfiniteScroll;

import React from "react";

const WoilonnToggle = ({ value, onClick }) => {
    const [checked, setChecked] = React.useState(value);

    React.useEffect(() => {
        setChecked(value);
    }, [value]);

    return (
        <div className={`woilonn-toggle ${checked ? "active" : "inactive"}`}>
            <div className="checkmark" />
        </div>
    );
};

export default WoilonnToggle;

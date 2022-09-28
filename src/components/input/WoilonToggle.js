import React from "react";

const WoilonnCheckbox = ({ value, onClick }) => {
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

export default WoilonnCheckbox;

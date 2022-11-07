import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as RequiredIcon } from "assets/images/icons/component/required.svg";
import { CircularProgress } from "@mui/material";
import { ReactComponent as ArrowBottomIcon } from "assets/images/icons/component/arrow_bottom.svg";
import RippleEffect from "components/surface/RippleEffect";
import { BottomSheet } from "react-spring-bottom-sheet";
import CommonButton from "components/button/CommonButton";

const WoilonnSelect = ({
    className,
    children,
    label,
    required,
    value,
    onChange,
    datas,
}) => {
    const { t } = useTranslation();
    const containerRef = React.useRef(null);
    const dropdownRef = React.useRef(null);
    const [openDropdown, setOpenDropdown] = React.useState(false);

    React.useEffect(() => {
        if (openDropdown) {
            dropdownRef.current.style.display = "flex";
        } else {
            dropdownRef.current.style.display = "none";
        }
    }, [openDropdown]);

    return (
        <>
            <div
                className={`woilonn-select ${className} ${
                    openDropdown ? "open" : "close"
                }`}
            >
                {Boolean(label) && (
                    <div className={`label ${required && "required"}`}>
                        {label}
                        {required && <RequiredIcon />}
                    </div>
                )}
                <div
                    ref={containerRef}
                    className={`select-box`}
                    onClick={() => {
                        setOpenDropdown(!openDropdown);
                    }}
                >
                    <span>{Boolean(value) && t(value?.i18nKey)}</span>
                    <ArrowBottomIcon />
                </div>
                <div
                    ref={dropdownRef}
                    className={`dropdown`}
                    onClick={() => setOpenDropdown(false)}
                >
                    {openDropdown && (
                        <ul
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                        >
                            {(datas || []).map((data) => (
                                <li key={data.key}>
                                    <RippleEffect
                                        className="container"
                                        onClick={() => {
                                            if (onChange) onChange(data);
                                            setOpenDropdown(false);
                                        }}
                                    >
                                        <span>{t(data.i18nKey)}</span>
                                    </RippleEffect>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default WoilonnSelect;

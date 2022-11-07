import React from "react";
import PhoneInput from "react-phone-number-input";
import { ReactComponent as RequiredIcon } from "assets/images/icons/component/required.svg";
import { CircularProgress } from "@mui/material";

const WoilonnInput = ({
    className,
    label,
    type,
    placeholder,
    value: _value,
    onChange,
    onKeyPress,
    disabled,
    alert,
    required,
    multiline,
    right,
    loading,
    autoFocus,
}) => {
    const textareaRef = React.useRef(null);
    const containerRef = React.useRef(null);

    const value = React.useMemo(() => _value, [_value]);

    React.useEffect(() => {
        if (multiline) {
            if (textareaRef.current && containerRef.current) {
                const textarea = textareaRef.current;
                const container = containerRef.current;

                textarea.style.height = "auto";
                const height = textarea.scrollHeight;
                textarea.style.height = `${height}px`;
                container.style.height = `${height + 32}px`;
            }
        }
    }, [multiline, value]);

    return (
        <div className={`woilonn-input ${className}`}>
            {Boolean(label) && (
                <div className={`label ${required && "required"}`}>
                    {label}
                    {required && <RequiredIcon />}
                </div>
            )}
            <div ref={containerRef} className="input-container">
                {loading ? (
                    <CircularProgress color="primary" size={25} />
                ) : (
                    <>
                        {type === "tel" ? (
                            <PhoneInput
                                defaultCountry="KR"
                                placeholder={placeholder || null}
                                value={value}
                                onChange={onChange}
                                disabled={disabled}
                            />
                        ) : multiline ? (
                            <textarea
                                ref={textareaRef}
                                placeholder={placeholder || null}
                                type={type}
                                value={value}
                                onChange={onChange}
                                rows="3"
                                autoFocus={autoFocus ? autoFocus : false}
                            />
                        ) : (
                            <input
                                type={type || "text"}
                                placeholder={placeholder || null}
                                value={value}
                                onChange={onChange}
                                onKeyPress={onKeyPress}
                                disabled={disabled}
                                autoFocus={autoFocus ? autoFocus : false}
                            />
                        )}
                        {right && <div className="input-right">{right}</div>}
                    </>
                )}
            </div>
            {Boolean(alert) && <div className="alert">{alert}</div>}
        </div>
    );
};

export default React.memo(WoilonnInput);

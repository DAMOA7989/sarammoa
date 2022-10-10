import React from "react";
import PhoneInput from "react-phone-number-input";
import { ReactComponent as RequiredIcon } from "assets/images/icons/component/required.svg";

const WoilonnInput = ({
    className,
    label,
    type,
    placeholder,
    value,
    onChange,
    onKeyPress,
    disabled,
    alert,
    required,
    multiline,
    right,
}) => {
    const textareaRef = React.useRef(null);
    const containerRef = React.useRef(null);

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
                        type={type}
                        value={value}
                        onChange={onChange}
                        rows="1"
                    />
                ) : (
                    <input
                        type={type || "text"}
                        placeholder={placeholder || null}
                        value={value}
                        onChange={onChange}
                        onKeyPress={onKeyPress}
                        disabled={disabled}
                    />
                )}
                {right && <div className="input-right">{right}</div>}
            </div>
            {Boolean(alert) && <div className="alert">{alert}</div>}
        </div>
    );
};

export default WoilonnInput;

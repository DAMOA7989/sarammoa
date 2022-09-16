import React from "react";
import { useTranslation } from "react-i18next";

const Message = () => {
    const { t } = useTranslation();

    return <div className="pages-protected-notice-message">message</div>;
};

export default Message;

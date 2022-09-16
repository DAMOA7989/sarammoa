import React from "react";

const MessageCard = ({ user: _user, message, date }) => {
    return (
        <div className="message-card">
            <div className="profile-thumbnail">
                <img
                    src={_user?.profileThumbnailUrl}
                    alt="profile thumbnail"
                    loading="lazy"
                />
            </div>
            <div className="content">
                <div className="nickname">{_user?.nickname}</div>
                <div className="message">{message}</div>
            </div>
            <div className="date">{date}</div>
        </div>
    );
};

export default MessageCard;

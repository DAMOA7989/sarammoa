import React from "react";

const NotificationCard = ({ user: _user, message, date }) => {
    return (
        <div className="notification-card">
            <div className="profile-thumbnail">
                <img
                    src={_user?.profileThumbnailUrl}
                    alt="profile thumbnail"
                    loading="lazy"
                />
            </div>
            <div className="content">
                <div className="message">{message}</div>
            </div>
            <div className="date">{date}</div>
        </div>
    );
};

export default NotificationCard;

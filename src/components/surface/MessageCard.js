import React from "react";
import LazyImage from "./LazyImage";
import LazyTypography from "./LazyTypography";
import { _getCounterpartInfo } from "utils/firebase/notice";
import { useAuthContext } from "utils/auth";
import { displayDate } from "utils/string";

const MessageCard = ({ rid, thumbnailUrl, title, lastMessage, onClick }) => {
    const { userInfo } = useAuthContext();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "TASK_DONE":
                    return {
                        ...state,
                        loaded: true,
                    };
                case "SET_USER_INFO":
                    return {
                        ...state,
                        loaded: true,
                        userInfo: action.payload?.doc,
                    };
            }
        },
        {
            loaded: false,
            userInfo: null,
        }
    );

    React.useEffect(() => {
        if (Boolean(thumbnailUrl) && Boolean(title)) {
            dispatch({
                type: "TASK_DONE",
            });
        } else {
            _getCounterpartInfo({ myUid: userInfo?.id, rid })
                .then((doc) => {
                    dispatch({
                        type: "SET_USER_INFO",
                        payload: {
                            doc,
                        },
                    });
                })
                .catch((e) => {
                    console.dir(e);
                });
        }
    }, []);

    return (
        <div className="message-card" onClick={state.loaded ? onClick : null}>
            <div className="profile-thumbnail">
                <LazyImage
                    src={
                        state.userInfo
                            ? state.userInfo.profileThumbnailUrl
                            : thumbnailUrl
                    }
                    alt="thumbnail"
                />
            </div>
            <div className="content">
                <div className="nickname">
                    <LazyTypography width={60}>
                        {state.loaded &&
                            (state.userInfo ? state.userInfo.nickname : title)}
                    </LazyTypography>
                </div>
                <div className="message">
                    <LazyTypography width={120}>
                        {state.loaded && lastMessage?.message}
                    </LazyTypography>
                </div>
            </div>
            <div className="date">
                <LazyTypography>
                    {state.loaded &&
                        `${
                            lastMessage?.createdAt?.toDate().toDateString() ||
                            ""
                        } 
                        ${displayDate(
                            "hh:mm",
                            lastMessage?.createdAt?.toDate()
                        )}`}
                </LazyTypography>
            </div>
        </div>
    );
};

export default MessageCard;

import React from "react";
import { _getUserInfo } from "utils/firebase/auth";
import LazyImage from "./LazyImage";
import LazyTypography from "./LazyTypography";

const PersonCard = ({ uid }) => {
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "FETCH_USER_INFO_PENDING":
                    return {
                        ...state,
                        userInfoLoading: true,
                    };
                case "FETCH_USER_INFO_FULFILLED":
                    return {
                        ...state,
                        userInfoLoading: false,
                        userInfo: action.payload?.doc,
                    };
                case "FETCH_USER_INFO_REJECTED":
                    return {
                        ...state,
                        userInfoLoading: false,
                    };
            }
        },
        {
            userInfoLoading: false,
            userInfo: null,
        }
    );

    React.useEffect(() => {
        if (!uid) return;

        dispatch({
            type: "FETCH_USER_INFO_PENDING",
        });
        _getUserInfo({ uid })
            .then((doc) => {
                console.log("d doc", doc);
                dispatch({
                    type: "FETCH_USER_INFO_FULFILLED",
                    payload: {
                        doc,
                    },
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "FETCH_USER_INFO_REJECTED",
                });
            });
    }, [uid]);

    return (
        <div className="person-card">
            <div className="profile-thumbnail">
                <LazyImage
                    src={state.userInfo?.profileThumbnailUrl}
                    alt="profile thumbnail"
                />
            </div>
            <div className="info">
                <span className="nickname">
                    <LazyTypography width={40} fontSize="0.8125rem">
                        {state.userInfo?.nickname}
                    </LazyTypography>
                </span>
                <span className="position">
                    <LazyTypography width={60} fontSize="0.75rem">
                        {state.userInfo?.position}
                    </LazyTypography>
                </span>
            </div>
        </div>
    );
};

export default PersonCard;

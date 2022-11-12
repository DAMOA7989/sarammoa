import React from "react";
import LazyImage from "./LazyImage";
import { Skeleton } from "@mui/material";
import { _getUserInfoDetail } from "utils/firebase/auth";

const IdCard = ({ className, uid, size, userInfo: _userInfo }) => {
    const [loaded, setLoaded] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState(null);

    React.useEffect(() => {
        if (Boolean(_userInfo) && Object.keys(_userInfo || {}).length > 0) {
            if (!Boolean(_userInfo?.profileThumbnailUrl)) {
                return setLoaded(false);
            }

            if (!Boolean(_userInfo?.nickname)) {
                return setLoaded(false);
            }

            setUserInfo(_userInfo);
            return setLoaded(true);
        } else if (Boolean(uid)) {
            _getUserInfoDetail({ uid })
                .then((result) => {
                    setUserInfo(result);
                    setLoaded(true);
                })
                .catch((e) => {
                    console.dir(e);
                    setLoaded(true);
                });
        }
    }, []);

    return (
        <div className={`id-card ${className} ${size}`}>
            <div className="profile-thumbnail">
                <LazyImage
                    src={userInfo?.profileThumbnailUrl}
                    alt="profile thumbnail"
                />
            </div>

            <div className="nickname">
                {loaded ? (
                    userInfo?.nickname
                ) : (
                    <Skeleton
                        className="skeleton"
                        variant="text"
                        animation="wave"
                    />
                )}
            </div>
        </div>
    );
};

export default IdCard;

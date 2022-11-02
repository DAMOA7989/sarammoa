import React from "react";
import LazyImage from "./LazyImage";
import LazyTypography from "./LazyTypography";
import { _getUserInfoDetail } from "utils/firebase/auth";

const CommentCard = ({ writerId, message, createdAt }) => {
    const [loaded, setLoaded] = React.useState(false);
    const [writerInfo, setWriterInfo] = React.useState(null);

    React.useEffect(() => {
        _getUserInfoDetail({ uid: writerId })
            .then((result) => {
                setWriterInfo(result);
                setLoaded(true);
            })
            .catch((e) => {
                console.dir(e);
            });
    }, []);

    return (
        <article className="comment-card">
            <div className="profile-thumbnail">
                <LazyImage
                    src={writerInfo?.profileThumbnailUrl}
                    alt="profile thumbnail"
                />
            </div>
            <div className="comment">
                <h5 className="nickname">
                    <LazyTypography width={160}>
                        {writerInfo?.nickname}
                    </LazyTypography>
                </h5>
                <p className="message">
                    <LazyTypography>{loaded ? message : null}</LazyTypography>
                </p>
                <span className="created-at">
                    <LazyTypography>
                        {loaded ? createdAt?.toDate()?.toDateString() : null}
                    </LazyTypography>
                </span>
            </div>
        </article>
    );
};

export default CommentCard;

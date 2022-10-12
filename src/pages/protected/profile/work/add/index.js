import React from "react";
import { useTranslation } from "react-i18next";
import ScreenCarousel from "components/layout/ScreenCarousel";
import ProfileHistoryAddEdit from "./edit";
import ProfileHistoryAddCover from "./cover";
import ProfileHistoryAddSubmit from "./submit";
import { useNavigateContext } from "utils/navigate";
import { useSearchParams } from "react-router-dom";
import { _getWritingDetail } from "utils/firebase/writing";

const ProfileHistoryAdd = () => {
    const navigate = useNavigateContext();
    const [search] = useSearchParams();
    const [screenIdx, setScreenIdx] = React.useState(0);
    const [contents, setContents] = React.useState([]);
    const [cover, setCover] = React.useState(null);
    const [coverUrl, setCoverUrl] = React.useState(null);
    const mode = React.useRef(search.get("mode"));
    const wid = React.useRef(search.get("wid"));
    const [writingInfo, setWritingInfo] = React.useState(null);

    React.useEffect(() => {
        if (!Boolean(mode.current) || !Boolean(wid.current)) return;

        _getWritingDetail({ wid: wid.current })
            .then((_writingInfo) => {
                setWritingInfo(_writingInfo);
            })
            .catch((e) => {
                console.dir(e);
            });
    }, [mode.current, wid.current]);

    React.useEffect(() => {
        if (!writingInfo?.contents) return;
        setContents(writingInfo.contents);
    }, [writingInfo]);

    return (
        <ScreenCarousel
            mode="sub"
            screenIdx={screenIdx}
            setScreenIdx={setScreenIdx}
            screens={[
                <ProfileHistoryAddEdit
                    mode={mode.current}
                    wid={wid.current}
                    writingInfo={writingInfo}
                    contents={contents}
                    setContents={setContents}
                />,
                <ProfileHistoryAddCover
                    mode={mode.current}
                    wid={wid.current}
                    writingInfo={writingInfo}
                    contents={contents}
                    setContents={setContents}
                    cover={cover}
                    setCover={setCover}
                    coverUrl={coverUrl}
                    setCoverUrl={setCoverUrl}
                />,
                <ProfileHistoryAddSubmit
                    mode={mode.current}
                    wid={wid.current}
                    writingInfo={writingInfo}
                    contents={contents}
                    setContents={setContents}
                    cover={cover}
                    setCover={setCover}
                    coverUrl={coverUrl}
                    setCoverUrl={setCoverUrl}
                />,
            ]}
        />
    );
};

export default ProfileHistoryAdd;

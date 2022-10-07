import React from "react";
import { useTranslation } from "react-i18next";
import ScreenCarousel from "components/layout/ScreenCarousel";
import ProfileHistoryAddEdit from "./edit";
import ProfileHistoryAddCover from "./cover";
import ProfileHistoryAddSubmit from "./submit";
import { useNavigateContext } from "utils/navigate";

const ProfileHistoryAdd = () => {
    const navigate = useNavigateContext();
    const [screenIdx, setScreenIdx] = React.useState(0);
    const [contents, setContents] = React.useState([]);
    const [cover, setCover] = React.useState(null);
    const [coverUrl, setCoverUrl] = React.useState(null);

    return (
        <ScreenCarousel
            mode="sub"
            screenIdx={screenIdx}
            setScreenIdx={setScreenIdx}
            screens={[
                <ProfileHistoryAddEdit
                    contents={contents}
                    setContents={setContents}
                />,
                <ProfileHistoryAddCover
                    contents={contents}
                    setContents={setContents}
                    cover={cover}
                    setCover={setCover}
                    coverUrl={coverUrl}
                    setCoverUrl={setCoverUrl}
                />,
                <ProfileHistoryAddSubmit
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

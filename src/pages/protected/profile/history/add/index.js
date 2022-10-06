import React from "react";
import { useTranslation } from "react-i18next";
import ScreenCarousel from "components/layout/ScreenCarousel";
import ProfileHistoryAddEdit from "./edit";
import ProfileHistoryAddSubmit from "./submit";
import { useNavigateContext } from "utils/navigate";

const ProfileHistoryAdd = () => {
    const navigate = useNavigateContext();
    const [screenIdx, setScreenIdx] = React.useState(0);
    const [contents, setContents] = React.useState([]);

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
                <ProfileHistoryAddSubmit
                    contents={contents}
                    setContents={setContents}
                />,
            ]}
        />
    );
};

export default ProfileHistoryAdd;

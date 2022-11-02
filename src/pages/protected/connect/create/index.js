import React from "react";
import { useTranslation } from "react-i18next";
import ScreenCarousel from "components/layout/ScreenCarousel";
import ConnectCreateInfo from "./info";
import ConnectCreateInvite from "./invite";
import ConnectCreateSubmit from "./submit";

const ConnectCreate = () => {
    const { t } = useTranslation();
    const [screenIdx, setScreenIdx] = React.useState(0);

    return (
        <ScreenCarousel
            mode="sub"
            screenIdx={screenIdx}
            setScreenIdx={setScreenIdx}
            screens={[
                <ConnectCreateInfo />,
                <ConnectCreateInvite />,
                <ConnectCreateSubmit />,
            ]}
        />
    );
};

export default ConnectCreate;

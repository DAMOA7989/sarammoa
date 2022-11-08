import React from "react";
import { useTranslation } from "react-i18next";
import Index from "./initUser/index";
import Agreement from "./initUser/Agreement";
import ValidatePhoneNumber from "./initUser/ValidatePhoneNumber";
import ScreenCarousel from "components/layout/ScreenCarousel";

const InitUser = ({ modalId, uid, agrees }) => {
    const { t } = useTranslation();
    const [screenIdx, setScreenIdx] = React.useState(0);

    React.useEffect(() => {
        if (
            agrees?.privacyPolicy &&
            agrees?.termsOfUse &&
            agrees?.marketingInfo
        ) {
            return setScreenIdx(2);
        }
    }, []);

    return (
        <ScreenCarousel
            screenIdx={screenIdx}
            setScreenIdx={setScreenIdx}
            screens={[
                <Index modalId={modalId} uid={uid} />,
                <Agreement modalId={modalId} uid={uid} />,
                <ValidatePhoneNumber modalId={modalId} uid={uid} />,
            ]}
        />
    );
};

export default InitUser;

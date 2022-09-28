import React from "react";
import { useTranslation } from "react-i18next";
import Index from "./initUser/index";
import Agreement from "./initUser/Agreement";
import ValidatePhoneNumber from "./initUser/ValidatePhoneNumber";
import ScreenCarousel from "components/layout/ScreenCarousel";

const InitUser = ({ uid, agrees }) => {
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
        <main className="modals-auth-init-user">
            <ScreenCarousel
                screenIdx={screenIdx}
                setScreenIdx={setScreenIdx}
                screens={[
                    <Index uid={uid} />,
                    <Agreement uid={uid} />,
                    <ValidatePhoneNumber uid={uid} />,
                ]}
            />
        </main>
    );
};

export default InitUser;

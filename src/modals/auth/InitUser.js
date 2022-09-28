import React from "react";
import { useTranslation } from "react-i18next";
import Index from "./initUser/index";
import Agreement from "./initUser/Agreement";
import ValidatePhoneNumber from "./initUser/ValidatePhoneNumber";
import ScreenCarousel from "components/layout/ScreenCarousel";

const InitUser = () => {
    const { t } = useTranslation();
    const [curScreenIdx, setCurScreenIdx] = React.useState(0);

    return (
        <main className="modals-auth-init-user">
            <ScreenCarousel
                screenIdx={curScreenIdx}
                setScreenIdx={setCurScreenIdx}
                screens={[<Index />, <Agreement />, <ValidatePhoneNumber />]}
            />
        </main>
    );
};

export default InitUser;

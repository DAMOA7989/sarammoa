import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useTranslation } from "react-i18next";

const BottomNavigator = () => {
    const { t } = useTranslation();
    const [openBottomSheet, setOpenBottomSheet] = React.useState(false);

    return (
        <nav className="components-navigator-bottom-navigator">
            <button onClick={() => setOpenBottomSheet(!openBottomSheet)}>
                {t("btn.start")}
            </button>
            <BottomSheet
                className=""
                open={openBottomSheet}
                onDismiss={() => setOpenBottomSheet(false)}
                snapPoints={({ maxHeight }) => 0.5 * maxHeight}
            >
                <div>sheet body</div>
            </BottomSheet>
        </nav>
    );
};

export default BottomNavigator;

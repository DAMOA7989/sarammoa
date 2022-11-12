import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import { useOutletContext } from "react-router-dom";
import CommonButton from "components/button/CommonButton";
import IdCard from "components/surface/IdCard";
import { useModal } from "utils/modal";

const ConnectCreateInvite = () => {
    const { t } = useTranslation();
    const { screenIdx, setScreenIdx } = useOutletContext();
    const navigate = useNavigateContext();
    const modal = useModal("connect/create/InvitePerson");
    const [selecteds, setSelecteds] = React.useState([]);

    React.useLayoutEffect(() => {
        navigate.setLayout({
            right: {
                next: {
                    title: t("btn.next"),
                    onClick: () => {
                        setScreenIdx(screenIdx + 1);
                    },
                },
            },
            goBack: {
                onClick: () => {
                    setScreenIdx(screenIdx - 1);
                },
            },
            screenTitle: "title.connect.create.invite",
        });
    }, []);

    return (
        <main className="protected-connect-create-invite">
            <div className="people">
                <ul>
                    {selecteds.map((personId, idx) => (
                        <li key={idx}>
                            <div className="container">
                                <IdCard uid={personId} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="invite">
                <CommonButton
                    className="button-invite"
                    color="primary"
                    onClick={() =>
                        modal.open({
                            params: {},
                            options: {},
                        })
                    }
                >
                    {t("btn.invite")}
                </CommonButton>
            </div>
        </main>
    );
};

export default ConnectCreateInvite;

import React from "react";
import { useTranslation } from "react-i18next";
import WoilonnInput from "components/input/WoilonnInput";
import WoilonnSelect from "components/input/WoilonnSelect";
import { ReactComponent as AddIcon } from "assets/images/icons/connect/add.svg";
import { ReactComponent as RemoveIcon } from "assets/images/icons/connect/remove.svg";
import RippleEffect from "components/surface/RippleEffect";
import CommonButton from "components/button/CommonButton";

const MemberComposition = ({ modalId, state, dispatch }) => {
    const { t } = useTranslation();
    const [position, setPosition] = React.useState(null);
    const [person, setPerson] = React.useState("");
    const [canAdd, setCanAdd] = React.useState(false);

    React.useEffect(() => {
        if (!position) return setCanAdd(false);
        if (!Boolean(person)) return setCanAdd(false);
        setCanAdd(true);
    }, [position, person]);

    const onAddHandler = () => {
        if (!position || !Boolean(person)) return;

        dispatch({
            type: "ADD_MEMBER_COMPOSITION",
            payload: {
                position,
                person,
            },
        });
        setPosition(null);
        setPerson("");
    };

    const onRemoveHandler = (key) => {};

    return (
        <main className="modals-connect-create-member-composition">
            <header>
                <span className="position">
                    {t("title.connect.create.info.member_composition.position")}
                </span>
                <span className="person">
                    {t("title.connect.create.info.member_composition.person")}
                </span>
                <span className="total">
                    {Object.values(state?.members || {}).reduce(
                        (p, c) => p + Number(c.person),
                        0
                    )}
                </span>
            </header>
            <main>
                <ul>
                    {Object.entries(state?.members || {}).map(
                        ([position, value], idx) => (
                            <li key={position}>
                                <div className="container">
                                    <div className="position">
                                        {t(value.i18nKey)}
                                    </div>
                                    <div className="person">{value.person}</div>
                                    <RippleEffect
                                        className="remove"
                                        onClick={() =>
                                            onRemoveHandler(position)
                                        }
                                    >
                                        <RemoveIcon />
                                    </RippleEffect>
                                </div>
                            </li>
                        )
                    )}
                </ul>
                <div className="add-row">
                    <div className="position">
                        <WoilonnSelect
                            value={position}
                            onChange={(item) => setPosition(item)}
                            datas={[
                                {
                                    key: "developer",
                                    i18nKey: "text.developer",
                                },
                                {
                                    key: "designer",
                                    i18nKey: "text.designer",
                                },
                                {
                                    key: "planner",
                                    i18nKey: "text.planner",
                                },
                                {
                                    key: "marketer",
                                    i18nKey: "text.marketer",
                                },
                            ]}
                        />
                    </div>
                    <div className="person">
                        <WoilonnInput
                            type="number"
                            value={person}
                            onChange={(event) => {
                                const { value } = event.target;
                                const onlyNumberPersonValue = value
                                    .replace(/[^0-9.]/g, "")
                                    .replace(/(\..*)\./g, "$1");
                                setPerson(onlyNumberPersonValue);
                            }}
                        />
                    </div>

                    <RippleEffect
                        className="remove"
                        onClick={() => onRemoveHandler(position)}
                    >
                        <RemoveIcon />
                    </RippleEffect>
                </div>
            </main>
            <footer className="add">
                <CommonButton
                    type="text"
                    onClick={onAddHandler}
                    disabled={!canAdd}
                >
                    <AddIcon />
                </CommonButton>
            </footer>
        </main>
    );
};

export default MemberComposition;

import React from "react";
import { useTranslation } from "react-i18next";
import ProfileHistoryCard from "components/surface/ProfileHistoryCard";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as PlusIcon } from "assets/images/icons/profile/plus.svg";
import { useNavigateContext } from "utils/navigate";
import { _getUserWritings } from "utils/firebase/writing";
import { useAuthContext } from "utils/auth";
import { CircularProgress } from "@mui/material";

const History = () => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const { userInfo } = useAuthContext();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "CLEAR_DOCS":
                    return {
                        ...state,
                        writeDocs: [],
                    };
                case "PUSH_DOCS_PENDING":
                    return {
                        ...state,
                        writeDocsLoading: true,
                    };
                case "PUSH_DOCS_FULFILLED":
                    const prevDocs = state.writeDocs || [];
                    const newDocs = action.payload?.docs || [];
                    if (!newDocs.length) return { ...state };

                    return {
                        ...state,
                        writeDocs: [...prevDocs, ...newDocs],
                        writeDocsLoading: false,
                    };
                case "PUSH_DOCS_REJECTED":
                    return {
                        ...state,
                        writeDocsLoading: false,
                    };
            }
        },
        {
            writeDocsLoading: false,
            writeDocs: [],
        }
    );

    React.useEffect(() => {
        if (userInfo?.id) {
            dispatch({
                type: "PUSH_DOCS_PENDING",
            });
            _getUserWritings({ uid: userInfo?.id })
                .then(({ docs }) => {
                    dispatch({
                        type: "PUSH_DOCS_FULFILLED",
                        payload: {
                            docs,
                        },
                    });
                })
                .catch((e) => {
                    console.dir(e);
                    dispatch({
                        type: "PUSH_DOCS_REJECTED",
                    });
                });
        } else {
            dispatch({
                type: "CLEAR_DOCS",
            });
        }

        return () => dispatch({ type: "CLEAR_DOCS" });
    }, [userInfo?.id]);

    return (
        <div className="pages-protected-profile-history">
            <section className="top">
                <div
                    className={`writes ${state.writeDocsLoading && "loading"}`}
                >
                    {state.writeDocsLoading ? (
                        <CircularProgress color="primary" size={25} />
                    ) : (
                        <ul>
                            {(state.writeDocs || []).map((write, idx) => (
                                <li key={idx}>
                                    <ProfileHistoryCard
                                        onClick={() => {
                                            navigate.push({
                                                pathname: `/writing/${write.id}`,
                                                mode: "sub",
                                            });
                                        }}
                                        coverUrl={write.cover}
                                        title={write.title}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
            <section className="bottom">
                <CommonButton
                    className="add"
                    color="primary"
                    onClick={() => {
                        navigate.push({
                            pathname: "/profile/history/add",
                            mode: "sub",
                        });
                    }}
                >
                    <PlusIcon />
                </CommonButton>
            </section>
        </div>
    );
};

export default React.memo(History);

import React from "react";
import { useTranslation } from "react-i18next";
import ProfileHistoryCard from "components/surface/ProfileHistoryCard";
import { useNavigateContext } from "utils/navigate";
import { useOutletContext } from "react-router-dom";
import { _getUserWritings } from "utils/firebase/writing";

const UserDetailWork = () => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const { userInfo } = useOutletContext();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "CLEAR_DOCS":
                    return {
                        ...state,
                        writingDocs: [],
                    };
                case "PUSH_DOCS_PENDING":
                    return {
                        ...state,
                        writingDocsLoading: true,
                    };
                case "PUSH_DOCS_FULFILLED":
                    const prevDocs = state.writingDocs || [];
                    const newDocs = action.payload?.docs || [];
                    if (!newDocs.length) {
                        return {
                            ...state,
                            writingDocsLoading: false,
                        };
                    }

                    return {
                        ...state,
                        writingDocs: [...prevDocs, ...newDocs],
                        writingDocsLoading: false,
                    };
                case "PUSH_DOCS_REJECTED":
                    return {
                        ...state,
                        writingDocsLoading: false,
                    };
            }
        },
        {
            writingDocsLoading: false,
            writingDocs: [],
        }
    );

    React.useLayoutEffect(() => {
        navigate.setLayout({
            right: {},
        });
    }, []);

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
        <div className="pages-public-user-detail-work">
            <div className={`writings`}>
                {state.writingDocsLoading ? (
                    <></>
                ) : (
                    <ul>
                        {(state.writingDocs || []).map((writing, idx) => (
                            <li key={idx}>
                                <ProfileHistoryCard
                                    onClick={() => {
                                        navigate.push({
                                            pathname: `/writing/${writing.id}`,
                                            mode: "sub",
                                        });
                                    }}
                                    coverUrl={writing.cover}
                                    title={writing.title}
                                />
                            </li>
                        ))}
                        {state.writingDocs?.length < 2 && <li></li>}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserDetailWork;

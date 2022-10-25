import React from "react";
import { CircularProgress } from "@mui/material";
import { useSearchParams, Navigate, useLocation } from "react-router-dom";
import { _searchWithParticipants, _getRoomInfo } from "utils/firebase/notice";
import { useNavigateContext } from "utils/navigate";

const NoticeMessageRedirect = ({}) => {
    const location = useLocation();
    const navigate = useNavigateContext();
    const [search] = useSearchParams();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "TASK_FINISH":
                    return {
                        ...state,
                        finish: true,
                    };
                case "SET_TO_RID":
                    return {
                        ...state,
                        finish: true,
                        toUrl: action.payload?.rid,
                    };
            }
        },
        {
            finish: false,
            toRid: null,
        }
    );

    React.useEffect(() => {
        const from = search.get("from");
        const to = search.get("to");

        _searchWithParticipants(from, to)
            .then((rids) => {
                const tasks = [];
                for (const rid of rids) {
                    tasks.push(
                        _getRoomInfo({ rid })
                            .then((doc) => {
                                if (doc?.type === "direct") {
                                    dispatch({
                                        type: "SET_TO_RID",
                                        payload: {
                                            rid,
                                        },
                                    });
                                }
                            })
                            .catch((e) => {
                                console.dir(e);
                            })
                    );
                }

                Promise.all(tasks).then(() =>
                    dispatch({
                        type: "TASK_FINISH",
                    })
                );
            })
            .catch((e) => {
                console.dir(e);
            });
    }, []);

    if (state.finish) {
        if (state.toRid) {
            navigate.replace({
                pathname: `/notice/${state.toRid}`,
                mode: "sub",
            });
            return null;
        } else {
            navigate.replace({
                pathname: `/notice/new`,
                mode: "sub",
            });
            return null;
        }
    }

    return (
        <main className="redirect">
            <CircularProgress size={40} />
        </main>
    );
};

export default NoticeMessageRedirect;

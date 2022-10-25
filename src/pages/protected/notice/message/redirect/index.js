import React from "react";
import { CircularProgress } from "@mui/material";
import { useSearchParams, Navigate, useLocation } from "react-router-dom";
import {
    _searchWithParticipants,
    _getRoomInfo,
    _createRoom,
} from "utils/firebase/notice";
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
                        toRid: action.payload?.rid,
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
                    tasks.push(_getRoomInfo({ rid }));
                }

                Promise.all(tasks).then((result) => {
                    const filteredDocs = (result || []).filter(
                        (x) => x.type === "direct"
                    );
                    if ((filteredDocs || []).length === 0) {
                        _createRoom(from, to)
                            .then((docId) => {
                                dispatch({
                                    type: "SET_TO_RID",
                                    payload: {
                                        rid: docId,
                                    },
                                });
                            })
                            .catch((e) => {
                                console.dir(e);
                                dispatch({
                                    type: "TASK_FINISH",
                                });
                            });
                    } else {
                        const doc = filteredDocs[0];
                        dispatch({
                            type: "SET_TO_RID",
                            payload: {
                                rid: doc.id,
                            },
                        });
                    }
                });
            })
            .catch((e) => {
                console.dir(e);
                dispatch({
                    type: "TASK_FINISH",
                });
            });
    }, []);

    if (state.finish) {
        if (state.toRid) {
            navigate.replace({
                pathname: `/notice/${state.toRid}`,
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

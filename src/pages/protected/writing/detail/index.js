import React from "react";
import { useParams } from "react-router-dom";
import { useNavigateContext } from "utils/navigate";
import { _getWritingDetail } from "utils/firebase/writing";
import { useStatusContext } from "utils/status";
import LazyImage from "components/surface/LazyImage";
import IdCard from "components/surface/IdCard";
import LazyTypography from "components/surface/LazyTypography";

const WritingDetail = () => {
    const { wid } = useParams();
    const navigate = useNavigateContext();
    const { task } = useStatusContext();
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_WRITING_INFO_PENDING":
                    return {
                        ...state,
                        writingInfoLoading: true,
                        writingInfo: null,
                    };
                case "SET_WRITING_INFO_FULFILLED":
                    return {
                        ...state,
                        writingInfoLoading: false,
                        writingInfo: action.payload?.doc,
                    };
                case "SET_WRITING_INFO_REJECTED":
                    return {
                        ...state,
                        writingInfoLoading: false,
                        writingInfo: null,
                    };
            }
        },
        {
            writingInfoLoading: false,
            writingInfo: null,
        }
    );

    React.useLayoutEffect(() => {
        navigate.setLayout({
            screenTitle: "",
        });
    }, [wid]);

    React.useEffect(() => {
        if (!Boolean(wid)) return;

        dispatch({ type: "SET_WRITING_INFO_PENDING" });
        // task.run();
        _getWritingDetail({ wid })
            .then((doc) => {
                dispatch({
                    type: "SET_WRITING_INFO_FULFILLED",
                    payload: {
                        doc,
                    },
                });
                // task.finish();
            })
            .catch((e) => {
                console.dir(e);
                dispatch({ type: "SET_WRITING_INFO_REJECTED" });
                // task.finish();
            });
    }, [wid]);

    console.log("d writingINfo", state.writingInfo);

    return (
        <main className="pages-protected-writing-detail">
            <header className="header">
                <h3 className="title">
                    <LazyTypography width={160} fontSize={"1.5rem"}>
                        {state.writingInfo?.title}
                    </LazyTypography>
                </h3>
                <IdCard
                    className="writer-card"
                    size="regular"
                    userInfo={state.writingInfo?.writer}
                />
            </header>
            <div className="contents"></div>
            <div className="info"></div>
            <div className="comment"></div>
        </main>
    );
};

export default WritingDetail;

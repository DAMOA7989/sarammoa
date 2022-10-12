import React from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as CameraIcon } from "assets/images/icons/profile/add/camera.svg";
import { ReactComponent as TextIcon } from "assets/images/icons/profile/add/text.svg";
import { useNavigateContext } from "utils/navigate";
import WoilonnInput from "components/input/WoilonnInput";

const ProfileWorkAddEdit = ({
    _idx,
    screenIdx,
    setScreenIdx,
    contents,
    setContents,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const containerRef = React.useRef(null);
    const inputTagRef = React.useRef(null);
    const editorRef = React.useRef(null);
    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_TEXT_START":
                    return {
                        ...state,
                        text: "",
                    };
                case "SET_TEXT":
                    return {
                        ...state,
                        text: action.payload?.value,
                    };
                case "SET_TEXT_FINISH":
                    return {
                        ...state,
                        text: null,
                    };
            }
        },
        {
            text: null,
        }
    );

    React.useLayoutEffect(() => {
        if (screenIdx === _idx) {
            navigate.setLayout({
                right:
                    typeof state.text === "string"
                        ? {
                              done: {
                                  title: t("btn.done"),
                                  onClick: () => {
                                      onTypeTextFinishHandler();
                                  },
                              },
                          }
                        : {
                              next: {
                                  title: t("btn.next"),
                                  disabled: contents.length <= 0,
                                  onClick: () => {
                                      setScreenIdx(screenIdx + 1);
                                  },
                              },
                          },
                screenTitle: "title.profile.history.add",
            });
        }
    }, [screenIdx, contents, state.text]);

    const handleCapture = (target) => {
        if (target.files) {
            if (target.files.length !== 0) {
                const file = target.files[0];
                setContents([
                    ...contents,
                    {
                        type: "photo",
                        value: file,
                    },
                ]);
            }
        }
    };

    const onTypeTextStartHandler = () => {
        dispatch({
            type: "SET_TEXT_START",
        });
    };

    const onTypeTextFinishHandler = () => {
        const typedText = state.text;

        if (Boolean(typedText)) {
            setContents([
                ...contents,
                {
                    type: "text",
                    value: typedText,
                },
            ]);
        }

        dispatch({
            type: "SET_TEXT_FINISH",
        });
    };

    return (
        <main
            ref={containerRef}
            className="pages-protected-profile-work-add-edit"
        >
            <div ref={editorRef} className="editor">
                {(contents || []).map((content, idx) => {
                    if (content.type === "photo") {
                        const value = content.value;
                        const reader = new FileReader();
                        reader.onload = () => {
                            const elem = document.getElementById(`img_${idx}`);
                            elem.src = reader.result;
                        };
                        reader.readAsDataURL(value);
                        return (
                            <div
                                key={idx}
                                className={`content content_${idx} img-container`}
                            >
                                <img
                                    id={`img_${idx}`}
                                    src={null}
                                    alt={`content_${idx}`}
                                />
                            </div>
                        );
                    } else if (content.type === "text") {
                        return (
                            <div
                                key={idx}
                                className={`content content_${idx} text-container`}
                            >
                                <p>{content.value}</p>
                            </div>
                        );
                    }
                })}
                {typeof state.text === "string" && (
                    <WoilonnInput
                        className={"input-text"}
                        value={state.text}
                        onChange={(event) =>
                            dispatch({
                                type: "SET_TEXT",
                                payload: {
                                    value: event.target.value,
                                },
                            })
                        }
                        multiline
                    />
                )}
            </div>

            <footer className="edits">
                <div className="container">
                    {typeof state.text === "string" ? (
                        <></>
                    ) : (
                        <>
                            <input
                                ref={inputTagRef}
                                accept="image/*"
                                id="select-image"
                                style={{
                                    display: "none",
                                }}
                                type="file"
                                onChange={(event) =>
                                    handleCapture(event.target)
                                }
                            />
                            <CommonButton
                                type="text"
                                color="transparent"
                                onClick={() => inputTagRef.current.click()}
                            >
                                <CameraIcon />
                            </CommonButton>
                            <CommonButton
                                type="text"
                                color="transparent"
                                onClick={onTypeTextStartHandler}
                            >
                                <TextIcon />
                            </CommonButton>
                        </>
                    )}
                </div>
            </footer>
        </main>
    );
};

export default ProfileWorkAddEdit;

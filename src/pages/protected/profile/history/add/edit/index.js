import React from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as CameraIcon } from "assets/images/icons/profile/add/camera.svg";
import { ReactComponent as TextIcon } from "assets/images/icons/profile/add/text.svg";
import { useNavigateContext } from "utils/navigate";

const ProfileHistoryAddEdit = ({
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

    React.useLayoutEffect(() => {
        if (screenIdx === _idx) {
            navigate.setLayout({
                right: {
                    next: {
                        title: t("btn.next"),
                        disabled: contents.length <= 0,
                        onClick: () => {
                            setScreenIdx(screenIdx + 1);
                        },
                    },
                },
            });
        }
    }, [screenIdx, contents]);

    React.useEffect(() => {
        // containerRef.current.scrollTop = containerRef.current.scrollHeight;
        // editorRef.current.scrollTop = editorRef.current.scrollHeight;
    }, [contents]);

    const handleCapture = (target) => {
        if (target.files) {
            if (target.files.length !== 0) {
                const file = target.files[0];
                setContents([...contents, file]);
            }
        }
    };

    const onTextClickHandler = () => {};

    return (
        <main
            ref={containerRef}
            className="pages-protected-profile-history-add-edit"
        >
            <div ref={editorRef} className="editor">
                {(contents || []).map((content, idx) => {
                    if (content instanceof Blob) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const elem = document.getElementById(`img_${idx}`);
                            elem.src = reader.result;
                        };
                        reader.readAsDataURL(content);
                        return (
                            <div key={idx} className="content img-container">
                                <img
                                    id={`img_${idx}`}
                                    src={null}
                                    alt={`content_${idx}`}
                                />
                            </div>
                        );
                    }
                })}
            </div>

            <footer className="edits">
                <div className="container">
                    <input
                        ref={inputTagRef}
                        accept="image/*"
                        id="select-image"
                        style={{
                            display: "none",
                        }}
                        type="file"
                        // capture="environment"
                        onChange={(event) => handleCapture(event.target)}
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
                        onClick={onTextClickHandler}
                    >
                        <TextIcon />
                    </CommonButton>
                </div>
            </footer>
        </main>
    );
};

export default ProfileHistoryAddEdit;

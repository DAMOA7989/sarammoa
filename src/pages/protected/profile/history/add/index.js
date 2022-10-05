import React from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "components/button/CommonButton";
import { ReactComponent as CameraIcon } from "assets/images/icons/profile/add/camera.svg";
import { ReactComponent as TextIcon } from "assets/images/icons/profile/add/text.svg";
import { useNavigateContext } from "utils/navigate";

const ProfileHistoryAdd = () => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const inputTagRef = React.useRef(null);
    const editorRef = React.useRef(null);
    const [contents, setContents] = React.useState([]);

    React.useLayoutEffect(() => {
        navigate.setLayout({
            right: {
                submit: {
                    title: t("btn.submit"),
                    onClick: onSubmitHandler,
                },
            },
        });

        return () => navigate.clearLayout();
    }, []);

    const handleCapture = (target) => {
        if (target.files) {
            if (target.files.length !== 0) {
                const file = target.files[0];
                setContents([...contents, file]);
            }
        }
    };

    const onTextClickHandler = () => {};

    const onSubmitHandler = () => {};

    return (
        <main className="pages-protected-profile-history-add">
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
            <div className="edits">
                <input
                    ref={inputTagRef}
                    accept="image/*"
                    id="select-image"
                    style={{
                        display: "none",
                    }}
                    type="file"
                    capture="environment"
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
        </main>
    );
};

export default ProfileHistoryAdd;

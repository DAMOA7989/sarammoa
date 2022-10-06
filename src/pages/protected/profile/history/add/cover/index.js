import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import LazyImage from "components/surface/LazyImage";

const ProfileHistoryAddCover = ({
    _idx,
    screenIdx,
    setScreenIdx,
    contents,
    setContents,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const slidesUlRef = React.useRef(0);
    const [slideImageUrls, setSlideImageUrls] = React.useState([]);

    React.useLayoutEffect(() => {
        if (screenIdx === _idx) {
            navigate.setLayout({
                right: {
                    next: {
                        title: t("btn.next"),
                        onClick: () => {
                            setScreenIdx(screenIdx + 1);
                        },
                    },
                },
            });
        }
    }, [screenIdx]);

    return (
        <main className="pages-protected-profile-history-add-cover">
            <div className="viewer"></div>
            <footer className="slides">
                <ul ref={slidesUlRef}>
                    {(contents || []).map((content, idx) => {
                        if (content instanceof File) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const img = document.getElementById(
                                    `image_${idx}`
                                );
                                img.src = reader.result;
                            };
                            reader.readAsDataURL(content);

                            return (
                                <li key={idx}>
                                    <div className="image-container">
                                        <img
                                            id={`image_${idx}`}
                                            src={null}
                                            alt={`screen_image_${idx}`}
                                        />
                                    </div>
                                </li>
                            );
                        }
                    })}
                </ul>
            </footer>
        </main>
    );
};

export default ProfileHistoryAddCover;

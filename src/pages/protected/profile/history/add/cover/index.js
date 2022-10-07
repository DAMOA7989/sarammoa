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
    cover,
    setCover,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const slidesUlRef = React.useRef(0);
    const [slideImageUrls, setSlideImageUrls] = React.useState([]);
    const [coverUrl, setCoverUrl] = React.useState(null);
    const imgSizeRate = React.useRef(1);

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

            for (const content of contents) {
                if (content instanceof File) {
                    setCover(content);
                    return;
                }
            }
        }
    }, [screenIdx]);

    React.useEffect(() => {
        if (cover instanceof File) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    imgSizeRate.current = img.width / img.height;
                    setCoverUrl(reader.result);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(cover);
        }
    }, [cover]);

    return (
        <main className="pages-protected-profile-history-add-cover">
            <div
                className="viewer"
                style={{
                    backgroundImage: `url(${coverUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize:
                        imgSizeRate.current >= 1
                            ? `${imgSizeRate * 100}% 100%`
                            : "100%",
                    backgroundPosition: "center",
                }}
            >
                <div className="top" />
                <div className="center">
                    <LazyImage src={coverUrl} alt="cover image" />
                </div>
                <div className="bottom" />
            </div>
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
                                <li
                                    key={idx}
                                    className={`${
                                        content === cover && "selected"
                                    }`}
                                >
                                    <div
                                        className="image-container"
                                        onClick={() => setCover(content)}
                                    >
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

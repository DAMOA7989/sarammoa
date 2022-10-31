import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigateContext } from "utils/navigate";
import LazyImage from "components/surface/LazyImage";
import { getResizedImageBlob } from "utils/converter";

const ProfileWorkAddCover = ({
    _idx,
    screenIdx,
    setScreenIdx,
    mode,
    wid,
    writingInfo,
    contents,
    setContents,
    cover,
    setCover,
    coverUrl,
    setCoverUrl,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const slidesUlRef = React.useRef(0);
    const [prevCover, setPrevCover] = React.useState(null);

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
                goBack: {
                    onClick: () => {
                        setScreenIdx(screenIdx - 1);
                    },
                },
                screenTitle: "title.profile.work.add.cover",
            });

            for (const content of contents) {
                if (content.type === "photo") {
                    setPrevCover(content);
                    return;
                }
            }
        }
    }, [screenIdx]);

    React.useEffect(() => {
        if (prevCover?.type === "photo") {
            if (prevCover?.value instanceof Blob) {
                const photo = prevCover.value;
                const reader = new FileReader();
                reader.onload = () => {
                    const img = new Image();
                    img.onload = () => {
                        setCoverUrl(reader.result);
                        getResizedImageBlob(prevCover.value).then((blob) =>
                            setCover(blob)
                        );
                    };
                    img.src = reader.result;
                };
                reader.readAsDataURL(photo);
            } else if (typeof prevCover?.value === "string") {
                setCover(prevCover.value);
                setCoverUrl(prevCover.value);
            }
        }
    }, [prevCover]);

    return (
        <main className="pages-protected-profile-work-add-cover">
            <div
                className="viewer"
                style={{
                    backgroundImage: `url(${coverUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize:
                        imgSizeRate.current >= 1
                            ? `${imgSizeRate.current * 100}vw ${100}vw`
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
                        if (content.type === "photo") {
                            if (content.value instanceof Blob) {
                                const photo = content.value;
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const img = document.getElementById(
                                        `image_${idx}`
                                    );
                                    img.src = reader.result;
                                };
                                reader.readAsDataURL(photo);
                            } else if (typeof content.value === "string") {
                                setTimeout(() => {
                                    const img = document.getElementById(
                                        `image_${idx}`
                                    );
                                    img.src = content.value;
                                }, 100);
                            }

                            return (
                                <li
                                    key={idx}
                                    className={`${
                                        content === prevCover && "selected"
                                    }`}
                                >
                                    <div
                                        className="image-container"
                                        onClick={() => setPrevCover(content)}
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

export default ProfileWorkAddCover;

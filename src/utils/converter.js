export const getResizedImageBlob = (
    imageFile,
    MAX_WIDTH = 720,
    MAX_HEIGHT = 720
) =>
    new Promise(async (resolve, reject) => {
        try {
            if (!Boolean(imageFile) || !(imageFile instanceof Blob)) {
                throw new Error();
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement("img");
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = height * (MAX_WIDTH / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = width * (MAX_HEIGHT / height);
                            height = MAX_HEIGHT;
                        }
                    }

                    const canvas = window.document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const oc = document.createElement("canvas");
                    const octx = oc.getContext("2d");

                    canvas.width = width;
                    canvas.height = height;

                    let cur = {
                        width: Math.floor(img.width * 0.5),
                        height: Math.floor(img.height * 0.5),
                    };

                    oc.width = cur.width;
                    oc.height = cur.height;

                    octx.drawImage(img, 0, 0, cur.width, cur.height);

                    while (cur.width * 0.5 > width) {
                        cur = {
                            width: Math.floor(cur.width * 0.5),
                            height: Math.floor(cur.height * 0.5),
                        };
                        octx.drawImage(
                            oc,
                            0,
                            0,
                            cur.width * 2,
                            cur.height * 2,
                            0,
                            0,
                            cur.width,
                            cur.height
                        );
                    }

                    ctx.drawImage(
                        oc,
                        0,
                        0,
                        cur.width,
                        cur.height,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    canvas.toBlob(resolve);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(imageFile);
        } catch (e) {
            return reject(e);
        }
    });

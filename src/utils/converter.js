export const getResizedImageBlob = (
    imageFile,
    MAX_WIDTH = 480,
    MAX_HEIGHT = 480
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
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(resolve);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(imageFile);
        } catch (e) {
            return reject(e);
        }
    });

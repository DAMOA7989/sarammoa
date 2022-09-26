export const copyText = ({ text }) =>
    new Promise(async (resolve, reject) => {
        try {
            await window.navigator.clipboard.writeText(text);
            return resolve();
        } catch (e) {
            return reject(e);
        }
    });

export const pasteText = ({}) =>
    new Promise(async (resolve, reject) => {
        try {
            const text = await window.navigator.clipboard.readText();
            return resolve(text);
        } catch (e) {
            return reject(e);
        }
    });

export const generateRandomNumberString = (cipher) => {
    return Math.random().toString().substr(2, cipher);
};

export const displayTime = (sec) => {
    if (sec < 0) {
        return "0:00";
    }
    let mm = String(Math.floor(sec / 60));

    sec %= 60;
    let ss = String(Math.floor(sec));
    if (ss.length === 0) {
        ss = "0" + ss;
    }
    if (ss.length === 1) {
        ss = "0" + ss;
    }

    return `${mm}:${ss}`;
};

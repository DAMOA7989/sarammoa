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

export const displayDate = (format, date) => {
    try {
        const milliseconds = date.getTime();
        const sec = milliseconds / 1000;

        switch (format) {
            case "hh:mm":
                let hh = String(date.getHours());
                if (hh.length < 2) hh = "0" + hh;
                let mm = String(date.getMinutes());
                if (mm.length < 2) mm = "0" + mm;
                return `${hh}:${mm}`;
        }
    } catch (e) {
        return "";
    }
};

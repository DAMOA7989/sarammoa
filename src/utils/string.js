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

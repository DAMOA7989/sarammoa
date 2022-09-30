module.exports.generateRandomNumberString = (cipher) => {
    return Math.random().toString().substr(2, cipher);
};

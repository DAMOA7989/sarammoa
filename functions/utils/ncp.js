module.exports.makeSignature = (url, timestamp, accessKey, secretKey) => {
    const crypto = require("crypto-js");

    const space = " ";
    const newLine = "\n";
    const method = "POST";

    const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(accessKey);

    const hash = hmac.finalize();

    return hash.toString(crypto.enc.Base64);
};

module.exports.makeFormData = (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
        searchParams.append(key, params[key]);
    });
    return searchParams;
};

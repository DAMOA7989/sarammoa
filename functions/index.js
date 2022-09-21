const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./config/sarammoa_service_account.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports.functions = functions;
module.exports.db = admin.firestore();
module.exports.firestore = admin.firestore;

exports.listener = {
    auth: require("./modules/listener/auth"),
};
exports.caller = {
    auth: require("./modules/caller/auth"),
};

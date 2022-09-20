const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
module.exports.functions = functions;
module.exports.db = admin.firestore();
module.exports.firestore = admin.firestore;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.auth = require("./modules/auth");
exports.auth.caller = require("./modules/auth.caller");

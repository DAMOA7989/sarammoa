const functions = require("../index").functions;

const generateRandomId = function () {
    return "user_" + Math.random().toString(36).substr(2, 8);
};

module.exports.setDefaultUserInfo = functions.firestore
    .document("users/{userId}")
    .onCreate((snap, context) => {
        return snap.ref.set({
            fullName: "",
            profileThumbnailUrl:
                "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/default%2FprofileThumbnail.png?alt=media&token=ee579067-ba85-435d-a84e-676edad1f3ad",
            nickname: generateRandomId(),
            position: "Person",
        });
    });

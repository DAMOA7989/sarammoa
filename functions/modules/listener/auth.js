const functions = require("../../index").functions;
const db = require("../../index").db;
const firestore = require("../../index").firestore;

const generateRandomId = function () {
    return "user_" + Math.random().toString(36).substr(2, 8);
};

// exports.onUserSignUp = functions
//     .region("asia-northeast2")
//     .firestore.document("users/{uid}")
//     .onCreate((snap, context) => {
//         const uid = context.params.uid;
//         const serverTimeStamp = firestore.FieldValue.serverTimestamp();

//         const updateParams = {};

//         snap.ref.set({
//             fullName: "",
//             profileThumbnailUrl:
//                 "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/default%2FprofileThumbnail.png?alt=media&token=ee579067-ba85-435d-a84e-676edad1f3ad",
//             nickname: generateRandomId(),
//             position: "Person",
//             createdAt: serverTimeStamp,
//         });

//         db.collection("messages")
//             .add({
//                 participants: ["sarammoa", uid],
//                 updatedAt: serverTimeStamp,
//                 createdAt: serverTimeStamp,
//             })
//             .then((docRef) => {
//                 docRef.collection("sends").add({
//                     sender: "sarammoa",
//                     message: "Nice to meet you!",
//                     createdAt: serverTimeStamp,
//                 });
//             });
//     });

exports.onCreateUser = functions
    .region("asia-northeast2")
    .auth.user()
    .onCreate((user) => {
        const uid = user.uid;
        const displayName = user.displayName;
        const photoURL = user.photoURL;
        const phoneNumber = user.phoneNumber;

        const updateParams = {};
        const randomId = generateRandomId();
        const serverTimeStamp = firestore.FieldValue.serverTimestamp();
        updateParams.fullName = Boolean(displayName) ? displayName : randomId;
        updateParams.nickname = Boolean(displayName) ? displayName : randomId;
        updateParams.profileThumbnailUrl = Boolean(photoURL)
            ? photoURL
            : "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/default%2FprofileThumbnail.png?alt=media&token=ee579067-ba85-435d-a84e-676edad1f3ad";
        updateParams.phoneNumber = Boolean(phoneNumber) ? phoneNumber : "";
        updateParams.position = "Person";
        updateParams.createdAt = serverTimeStamp;

        db.doc(`users/${uid}`).set(
            {
                ...updateParams,
                init: false,
            },
            {
                merge: true,
            }
        );

        db.collection("messages")
            .add({
                participants: ["sarammoa", uid],
                updatedAt: serverTimeStamp,
                createdAt: serverTimeStamp,
            })
            .then((docRef) => {
                docRef.collection("sends").add({
                    sender: "sarammoa",
                    message: "Nice to meet you!",
                    createdAt: serverTimeStamp,
                });
            });
    });

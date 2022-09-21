const functions = require("../../index").functions;
const db = require("../../index").db;
const auth = require("../../index").auth;
const axios = require("axios");
const admin = require("firebase-admin");

exports.getAccessTokenWithKakao = functions.https.onCall(
    (data, context) =>
        new Promise(async (resolve, reject) => {
            const redirect_uri = data.redirect_uri;
            const code = data.code;

            const makeFormData = (params) => {
                const searchParams = new URLSearchParams();
                Object.keys(params).forEach((key) => {
                    searchParams.append(key, params[key]);
                });
                return searchParams;
            };
            axios({
                method: "post",
                url: `${process.env.KAKAO_APP_HOST_URL}/oauth/token`,
                headers: {
                    "content-type":
                        "application/x-www-form-urlencoded;charset=utf-8",
                },
                data: makeFormData({
                    grant_type: "authorization_code",
                    client_id: process.env.KAKAO_APP_RESTAPI_KEY,
                    redirect_uri,
                    code,
                }),
            })
                .then((res) => res.data)
                .then((result) => {
                    resolve({
                        ...result,
                    });
                })
                .catch((e) => {
                    reject(e);
                });
        })
);

const requestMe = async (accessToken) => {
    const targetUrl = `https://kapi.kakao.com/v2/user/me`;

    return await axios({
        method: "get",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        url: targetUrl,
    }).then((result) => result.data);
};

const updateOrCreateUser = (uid, email, displayName, photoURL) => {
    const updateParams = {
        provider: "kakao",
        displayName,
    };
    if (photoURL) {
        updateParams["photoURL"] = photoURL;
    }

    return admin
        .auth()
        .updateUser(uid, updateParams)
        .catch((e) => {
            console.log("e code", e.code);
            if (e.code === "auth/user-not-found") {
                updateParams["uid"] = uid;
                if (email) {
                    updateParams["email"] = email;
                }
                return admin.auth().createUser(updateParams);
            }
            throw e;
        });
};

exports.createFirebaseToken = functions.https.onCall(
    (data, context) =>
        new Promise(async (resolve, reject) => {
            const accessToken = data.accessToken;
            requestMe(accessToken)
                .then((response) => {
                    const body = response;
                    const uid = `kakao:${body.id}`;
                    if (!uid) {
                        return reject({
                            statusCode: 404,
                            message:
                                "There was no user with the given access token.",
                        });
                    }
                    return updateOrCreateUser(
                        uid,
                        body.kakao_account?.email,
                        body.properties.nickname,
                        body.properties.profile_image
                    );
                })
                .then((userRecord) => {
                    const uid = userRecord.uid;
                    const firebaseToken = admin.auth().createCustomToken(uid, {
                        provider: "kakao",
                    });
                    resolve(firebaseToken);
                });
        })
);

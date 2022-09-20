const functions = require("../index").functions;
const db = require("../index").db;
const axios = require("axios");

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

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

exports.getAuthorizationCodeWithGmailApi = functions.https.onCall(
    (data, context) => {
        const { google } = require("googleapis");
        const credentials = require("../../config/gmail_api.json");
        credentials["installed"]["client_id"] = process.env.GMAIL_API_CLIENT_ID;
        credentials["installed"]["client_secret"] =
            process.env.GMAIL_API_CLIENT_SECRET;

        const { client_secret, client_id, redirect_uris } =
            credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );

        const GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

        const url = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: GMAIL_SCOPES,
        });

        return "Authorize this app by visiting this url: " + url;
    }
);

exports.createAuthorizedOAuth2ClientWithGmailApi = functions.https.onCall(
    (data, context) => {
        const { google } = require("googleapis");
        const path = require("path");
        const fs = require("fs");
        const credentials = require("../../config/gmail_api.json");
        credentials["installed"]["client_id"] = process.env.GMAIL_API_CLIENT_ID;
        credentials["installed"]["client_secret"] =
            process.env.GMAIL_API_CLIENT_SECRET;

        const code =
            "4/0ARtbsJqh5zl3xcuqRYtORqO5uEHrzbm8SM77D1DsDmfWUvY0RqsBcAnc5kvBJSJWnJCxfQ";
        const { client_secret, client_id, redirect_uris } =
            credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );

        oAuth2Client.getToken(code).then(({ tokens }) => {
            const tokenPath = path.join(
                __dirname,
                "../../config",
                "token.json"
            );
            fs.writeFileSync(tokenPath, JSON.stringify(tokens));
            console.log("Access token and refresh token stored to token.json");
        });
    }
);

const gmail = () => {
    const { google } = require("googleapis");
    const MailComposer = require("nodemailer/lib/mail-composer");
    const credentials = require("../../config/gmail_api.json");
    credentials["installed"]["client_id"] = process.env.GMAIL_API_CLIENT_ID;
    credentials["installed"]["client_secret"] =
        process.env.GMAIL_API_CLIENT_SECRET;
    const tokens = require("../../config/token.json");

    const getGmailService = () => {
        const { client_secret, client_id, redirect_uris } =
            credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );
        oAuth2Client.setCredentials(tokens);
        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
        return gmail;
    };

    const encodeMessage = (message) => {
        return Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    };

    const createMail = async (options) => {
        const mailComposer = new MailComposer(options);
        const message = await mailComposer.compile().build();
        return encodeMessage(message);
    };

    // sendMail
    return async (options) => {
        const gmail = getGmailService();
        const rawMessage = await createMail(options);
        const { data: { id } = {} } = await gmail.users.messages.send({
            userId: "me",
            resource: {
                raw: rawMessage,
            },
        });
        return id;
    };
};

exports.sendVerificationEmail = functions.https.onCall(
    (data, context) =>
        new Promise(async (resolve, reject) => {
            const toAddress = data.toAddress;

            const fs = require("fs");
            const path = require("path");
            const sendMail = gmail();

            // const fileAttachments = [
            //     {
            //       filename: 'attachment1.txt',
            //       content: 'This is a plain text file sent as an attachment',
            //     },
            //     {
            //       path: path.join(__dirname, './attachment2.txt'),
            //     },
            //     {
            //       filename: 'websites.pdf',
            //       path: 'https://www.labnol.org/files/cool-websites.pdf',
            //     },

            //     {
            //       filename: 'image.png',
            //       content: fs.createReadStream(path.join(__dirname, './attach.png')),
            //     },
            //   ];

            const options = {
                to: toAddress,
                // cc: '',
                // replyTo: '',
                subject: "Hello Amit 🚀",
                text: "This email is sent from the command line",
                html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
                // attachments: fileAttachments,
                textEncoding: "base64",
                headers: [
                    { key: "X-Application-Developer", value: "Amit Agarwal" },
                    { key: "X-Application-Version", value: "v1.0.0.2" },
                ],
            };

            const messageId = await sendMail(options);
            resolve(messageId);
        })
);

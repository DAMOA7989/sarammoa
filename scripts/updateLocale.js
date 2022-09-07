const fs = require("fs");
const path = require("path");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const serviceAccount = require("../src/config/updateLocaleServiceAccount.json");

const langDoc = {
    ko: {},
    en: {},
};

const doc = new GoogleSpreadsheet(
    "107VE4eAtAaQKh1XJYAmTE-1lPFOT0FOzfa1MpxN5mSg"
);
doc.useServiceAccountAuth({
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
})
    .then(() => {
        return doc.loadInfo();
    })
    .then(() => {
        const sheet = doc.sheetsById[106419020];
        return sheet.getRows();
    })
    .then((rows) => {
        for (const row of rows) {
            try {
                langDoc.ko[row.key] = row.ko;
                langDoc.en[row.key] = row.en;
            } catch (e) {}
        }
        return true;
    })
    .then(() => {
        fs.writeFile(
            path.resolve("src/i18n/locale", "ko.json"),
            JSON.stringify(langDoc.ko),
            (err) => {
                console.error(err);
            }
        );
        fs.writeFile(
            path.resolve("src/i18n/locale", "en.json"),
            JSON.stringify(langDoc.en),
            (err) => {
                console.error(err);
            }
        );
    })
    .then(() => {
        console.log("Done!");
    });

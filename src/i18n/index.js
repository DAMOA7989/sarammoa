import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import KO from "./locale/ko.json";
import EN from "./locale/en.json";

const resources = {
    ko: {
        translation: KO,
    },
    en: {
        translation: EN,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: "ko",
        fallbackLng: "ko",
        interpolation: {
            escapeValue: false,
        },
        react: {
            transKeepBasicHtmlNodesFor: ["br", "ol", "li"],
        },
    });

export default i18n;

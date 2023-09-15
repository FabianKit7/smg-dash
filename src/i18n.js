import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const apiKey = "G_T6R6km0CIO6SmH6mwxJQ";
const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${apiKey}`;
// const options = {
//     order: ['querystring', 'navigator'],
//     lookupQuerystring: 'lng'
// }

i18next
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // lng: 'en' // <--- turn off for detection to work
        // detection: options,
        fallbackLng: "fr",

        ns: ["default"],
        defaultNS: "default",

        supportedLngs: ["en", "fr"],

        backend: {
            loadPath: loadPath
        },
        // debug: process.env.NODE_ENV !== "production"
    })
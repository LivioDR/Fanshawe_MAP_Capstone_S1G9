import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import stringsEN from "./translations/en.json";
import stringsES from "./translations/es.json";

const languageDetector = {
    type: "languageDetector",
    detect: () => {
        return getLocales()[0].languageCode;
    },
};

export function initI18next() {
    i18next
        .use(languageDetector)
        .use(initReactI18next)
        .init({
            compatibilityJSON: "v3",

            fallbackLng: "en",

            resources: {
                en: {
                    translation: stringsEN,
                },
                es: {
                    translation: stringsES,
                },
            },

            // TODO: turn off debug
            debug: true,
        });
}
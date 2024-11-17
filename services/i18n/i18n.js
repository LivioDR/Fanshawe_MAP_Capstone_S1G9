import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import stringsEN from "./translations/en.json";
import stringsES from "./translations/es.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const languageDetector = {
    type: "languageDetector",
    // use an async detector to load from settings storage
    async: true,
    detect: async () => {
        const currentLng = await AsyncStorage.getItem(currentLngKey);
        // if we stored a language, return that, otherwise return the device language
        return !!currentLng ? currentLng : getLocales()[0].languageCode;
    },
};

export function initI18next() {
    // return the promise from init so we can wait until translations are loaded
    return i18next
        .use(languageDetector)
        .use(initReactI18next)
        .init({
            compatibilityJSON: "v3",

            // always use English as fallback, as all strings will be in English
            fallbackLng: "en",

            resources: {
                en: {
                    translation: stringsEN,
                },
                es: {
                    translation: stringsES,
                },
            },
        });
}

export const supportedLanguages = {
    "en": "English",
    "es": "Español",
};

export const currentLngKey = "current-lang";
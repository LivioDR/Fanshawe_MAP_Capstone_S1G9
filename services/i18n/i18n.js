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
    // set initial fallback to English
    let fallbackLng = "en";
    // if we support the current device language, fallback to that instead
    const deviceLng = getLocales()[0].languageCode
    if (deviceLng in supportedLanguages) {
        fallbackLng = deviceLng;
    }

    // return the promise from init so we can wait until translations are loaded
    return i18next
        .use(languageDetector)
        .use(initReactI18next)
        .init({
            compatibilityJSON: "v3",

            fallbackLng,

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

export const supportedLanguages = {
    "en": "English",
    "es": "Español",
};

export const currentLngKey = "current-lang";
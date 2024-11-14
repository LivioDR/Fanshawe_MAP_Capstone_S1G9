import { useTranslation } from "react-i18next";
import { currentLngKey, supportedLanguages } from "../../services/i18n/i18n";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useEffect, useState } from "react";

import { View, Text, Button } from "react-native";

import { Dropdown } from "react-native-element-dropdown";

import styles from "./styles";

export default function SettingsScreen() {
    const [languages] = useState(getLanguagesList());
    const [storedLanguage, setStoredLanguage] = useState(null);     // TODO: remove debug
    const { t, i18n } = useTranslation();

    // TODO: remove debug
    useEffect(() => {
        (async () => {
            const lang = await AsyncStorage.getItem(currentLngKey);
            setStoredLanguage(lang);
        })();
    }, []);

    const onLanguageChange = async ({ value }) => {
        i18n.changeLanguage(value);
        await AsyncStorage.setItem(currentLngKey, value);
        setStoredLanguage(value);   // TODO: remove debug
    };

    return (
        <View style={styles.container}>
            <View style={styles.settingContainer}>
                <Text style={styles.heading}>{t("settings.language")}</Text>
                <Dropdown
                    style={styles.dropdown}

                    data={languages}
                    labelField="label"
                    valueField="value"

                    search
                    searchField="label"
                    searchPlaceholder={t("settings.search")}

                    value={i18n.language}
                    onChange={onLanguageChange}
                />
            </View>

            {/* TODO: remove debug */}
            <View style={styles.settingContainer}>
                <Text>Stored language: {!!storedLanguage ? storedLanguage : "none"}</Text>
                <Button title="Clear saved language" onPress={async () => {
                    await AsyncStorage.removeItem(currentLngKey);
                    setStoredLanguage(null);
                }} />
            </View>
        </View>
    );
}

function getLanguagesList() {
    const data = [];

    for (let key in supportedLanguages) {
        data.push({
            label: `${supportedLanguages[key]} (${key})`,
            value: key,
        });
    }

    return data;
}
import { useTranslation } from "react-i18next";
import { currentLngKey, supportedLanguages } from "../../services/i18n/i18n";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useState } from "react";

import { View, Text } from "react-native";

import { Dropdown } from "react-native-element-dropdown";

import styles from "./styles";
import { useTheme } from "../../services/state/useTheme";
import { darkMode, lightMode, themeKey, darkBg, darkFont } from "../../services/themes/themes";

export default function SettingsScreen({ themeSetter }) {
    // Language settings
    const [languages] = useState(getLanguagesList());
    const { t, i18n } = useTranslation();

    const onLanguageChange = async ({ value }) => {
        i18n.changeLanguage(value);
        await AsyncStorage.setItem(currentLngKey, value);
    };

    // Themes setting
    const themes = getThemesList(t)
    const theme = useTheme()

    const onThemeChange = async({ value }) => {
        await AsyncStorage.setItem(themeKey, value)
        themeSetter(value)
    }

    return (
        <View style={[styles.container, theme == darkMode ? darkBg : {}]}>
            <View style={[styles.settingContainer, theme == darkMode ? darkFont : {}]}>
                <Text style={[styles.heading, theme == darkMode ? darkFont : {}]}>{t("settings.language")}</Text>
                <Dropdown
                    style={[styles.dropdown, theme == darkMode ? darkFont : {}]}

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

            {/* Theme configuration */}
            <View style={styles.settingContainer}>
                <Text style={styles.heading}>{t("settings.theme")}</Text>
                <Dropdown
                    style={styles.dropdown}

                    data={themes}
                    labelField="label"
                    valueField="value"

                    value={theme}
                    onChange={onThemeChange}
                />
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


function getThemesList(t) {
    return [
        {
            label: t("settings.themes.light"),
            value: lightMode,
        },
        {
            label: t("settings.themes.dark"),
            value: darkMode,
        }
    ]
}
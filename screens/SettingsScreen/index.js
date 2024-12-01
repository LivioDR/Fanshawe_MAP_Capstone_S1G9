import { useTranslation } from "react-i18next";
import { currentLngKey, supportedLanguages } from "../../services/i18n/i18n";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useState } from "react";

import { View, Text } from "react-native";

import { Dropdown } from "react-native-element-dropdown";

import styles from "./styles";
import { useTheme } from "../../services/state/useTheme";
import {
    darkMode,
    lightMode,
    themeKey,
    darkBg,
    darkFont,
} from "../../services/themes/themes";

import TrialCountdownDisplay from "../../components/trialCountdownDisplay";
import { useTrialCountdown } from "../../services/state/trialCountdown";

export default function SettingsScreen({ themeSetter }) {
    // Trial settings
    const { updateTrialCountdown, calculateTimeUntilExpiry, isTrialUser } =
        useTrialCountdown();

    // Language settings
    const [languages] = useState(getLanguagesList());
    const { t, i18n } = useTranslation();

    const onLanguageChange = async ({ value }) => {
        i18n.changeLanguage(value);
        await AsyncStorage.setItem(currentLngKey, value);
    };

    // Themes settings
    const themes = getThemesList(t);
    const theme = useTheme();
    const isDarkMode = theme === darkMode;

    const onThemeChange = async ({ value }) => {
        await AsyncStorage.setItem(themeKey, value);
        themeSetter(value);
    };

    return (
        <View style={[styles.container, isDarkMode ? darkBg : {}]}>
            {isTrialUser && <TrialCountdownDisplay />}
            <View style={[styles.settingContainer, isDarkMode ? darkFont : {}]}>
                <Text style={[styles.heading, isDarkMode ? darkFont : {}]}>
                    {t("settings.language")}
                </Text>
                <Dropdown
                    style={styles.dropdown}
                    // conditional color schemes
                    // text styling
                    itemTextStyle={isDarkMode ? darkFont : {}}
                    searchPlaceholderTextColor={isDarkMode ? darkFont : {}}
                    selectedTextStyle={isDarkMode ? darkFont : {}}
                    // background styling
                    itemContainerStyle={isDarkMode ? darkBg : {}}
                    activeColor={isDarkMode ? darkBg : {}}
                    containerStyle={isDarkMode ? darkBg : {}}
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
            <View
                style={[
                    styles.settingContainer,
                    theme == darkMode ? darkFont : {},
                ]}
            >
                <Text
                    style={[styles.heading, theme == darkMode ? darkFont : {}]}
                >
                    {t("settings.theme")}
                </Text>
                <Dropdown
                    style={styles.dropdown}
                    // conditional color schemes
                    // text styling
                    itemTextStyle={isDarkMode ? darkFont : {}}
                    searchPlaceholderTextColor={isDarkMode ? darkFont : {}}
                    selectedTextStyle={isDarkMode ? darkFont : {}}
                    // background styling
                    itemContainerStyle={isDarkMode ? darkBg : {}}
                    activeColor={isDarkMode ? darkBg : {}}
                    containerStyle={isDarkMode ? darkBg : {}}
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
        },
    ];
}

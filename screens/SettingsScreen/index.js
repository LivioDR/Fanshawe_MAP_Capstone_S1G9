import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { currentLngKey, supportedLanguages } from "../../services/i18n/i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
    const [languages] = useState(getLanguagesList());
    const [storedLanguage, setStoredLanguage] = useState(null);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        (async () => {
            const lang = await AsyncStorage.getItem(currentLngKey);
            setStoredLanguage(lang);
        })();
    });

    const onLanguageChange = async ({ value }) => {
        i18n.changeLanguage(value);
        await AsyncStorage.setItem(currentLngKey, value);
        setStoredLanguage(value);
    };

    return (
        <View>
            <Text>Language</Text>
            <Dropdown
                data={languages}
                labelField="label"
                valueField="value"
                value={i18n.language}
                onChange={onLanguageChange}
            />

            {/* TODO: remove debug */}
            <Text>Stored language: {!!storedLanguage ? storedLanguage : "none"}</Text>
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
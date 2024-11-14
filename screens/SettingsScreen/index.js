import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { supportedLanguages } from "../../services/i18n/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SettingsScreen() {
    const [languages] = useState(getLanguagesList());
    const { t, i18n } = useTranslation();

    return (
        <View>
            <Text>Language</Text>
            <Dropdown
                data={languages}
                labelField="label"
                valueField="value"
                value={i18n.language}
                onChange={({ value }) => i18n.changeLanguage(value)}
            />
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
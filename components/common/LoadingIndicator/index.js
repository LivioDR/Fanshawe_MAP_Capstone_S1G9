import { useTranslation } from "react-i18next";

import { View, Text, ActivityIndicator } from "react-native";

import styles from "./styles";

export default function LoadingIndicator() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
            <Text style={styles.text}>{t("common.loading")}</Text>
        </View>
    );
}
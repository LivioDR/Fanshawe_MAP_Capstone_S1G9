import { useTranslation } from "react-i18next";

import { View, Text, ActivityIndicator } from "react-native";

import styles from "./styles";

export default function LoadingIndicator({ textOverride }) {
    let t;
    if (!textOverride) {
        t = useTranslation().t;
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
            <Text style={styles.text}>{!!textOverride ? textOverride : t("common.loading")}</Text>
        </View>
    );
}
import { View, Text, ActivityIndicator } from "react-native";

import styles from "./styles";

export default function LoadingIndicator() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}
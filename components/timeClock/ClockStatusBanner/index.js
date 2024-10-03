import { View, Text } from "react-native";

import styles from "./styles";

export default function ClockStatusBanner() {
    return (
        <View style={styles.banner}>
            <Text style={styles.text}>
                You have been clocked in since 8:59 am.
            </Text>
        </View>
    );
}
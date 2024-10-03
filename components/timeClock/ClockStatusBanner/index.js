import { View, Text } from "react-native";

import styles from "./styles";

export default function ClockStatusBanner({ clockedIn, onLunch, clockInTime = "8:59 am", lunchTime = "12:01 pm" }) {
    let bannerStyle = styles.banner.clockedOut;
    let bannerText = "You are not clocked in.";
    if (onLunch) {
        bannerStyle = styles.banner.onLunch;
        bannerText = `You have been on lunch since ${lunchTime}.`;
    } else if (clockedIn) {
        bannerStyle = styles.banner.clockedIn;
        bannerText = `You have been clocked in since ${clockInTime}.`;
    }

    return (
        <View style={[styles.banner, bannerStyle]}>
            <Text style={styles.text}>
                {bannerText}
            </Text>
        </View>
    );
}
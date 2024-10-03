import { View, Text } from "react-native";

import styles from "./styles";

export default function ClockStatusBanner({ clockStatus }) {
    // TODO: replace with time values from status
    const clockInTime = "8:59 am";
    const lunchTime = "12:01 pm";

    let bannerStyle = styles.banner.clockedOut;
    let bannerText = "You are not clocked in.";
    if (clockStatus.onLunch) {
        bannerStyle = styles.banner.onLunch;
        bannerText = `You have been on lunch since ${lunchTime}.`;
    } else if (clockStatus.clockedIn) {
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
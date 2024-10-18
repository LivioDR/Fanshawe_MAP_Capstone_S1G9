import { View, Text } from "react-native";

import { Timestamp } from "firebase/firestore";

import styles from "./styles";

export default function ClockStatusBanner({ clockStatus, name }) {
    const clockInTime = clockStatus.timeLog?.clockInTime ? timestampToTimeString(clockStatus.timeLog.clockInTime) : "";
    const lunchTime = clockStatus.timeLog?.onLunchTime ? timestampToTimeString(clockStatus.timeLog.onLunchTime) : "";

    const isAre = name ? "is" : "are";
    const hasHave = name ? "has" : "have";
    name = name ? name : "You";

    let bannerStyle = styles.banner.clockedOut;
    let bannerText = `${name} ${isAre} not clocked in.`;
    if (clockStatus.onLunch) {
        bannerStyle = styles.banner.onLunch;
        bannerText = `${name} ${hasHave} been on lunch since ${lunchTime}.`;
    } else if (clockStatus.clockedIn) {
        bannerStyle = styles.banner.clockedIn;
        bannerText = `${name} ${hasHave} been clocked in since ${clockInTime}.`;
    }

    return (
        <View style={[styles.banner, bannerStyle]}>
            <Text style={styles.text}>
                {bannerText}
            </Text>
        </View>
    );
}

/**
 * Given a Firebase Timestamp, convert it to a displayable time string.
 * @param {Timestamp} time Firebase Timestamp object
 * @returns formatted string representing the time
 */
function timestampToTimeString(stamp) {
    return stamp
            .toDate()   // convert to JS Date object
            // convert to a locale string
            .toLocaleTimeString([],
                {
                    // use 12-hour time
                    hour12: true,
                    // show number as numeric to omit leading 0's
                    hour: "numeric",
                    // always show 2-digit minute
                    minute: "2-digit",
                }
            )
            // lowercase the AM/PM
            .toLowerCase();
}
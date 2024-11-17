import { useTranslation } from "react-i18next";

import { View, Text } from "react-native";

import { Timestamp } from "firebase/firestore";

import styles from "./styles";

export default function ClockStatusBanner({ clockStatus, name }) {
    const { t } = useTranslation();

    const clockInTime = clockStatus.timeLog?.clockInTime ? timestampToTimeString(clockStatus.timeLog.clockInTime) : "";
    const lunchTime = clockStatus.timeLog?.onLunchTime ? timestampToTimeString(clockStatus.timeLog.onLunchTime) : "";

    const isOther = !!name;

    let bannerStyle = styles.banner.clockedOut;
    let bannerText = isOther ? t("timeClock.status.other.clockedOut", { name }) : t("timeClock.status.user.clockedOut");
    if (clockStatus.onLunch) {
        bannerStyle = styles.banner.onLunch;
        bannerText = isOther ? t("timeClock.status.other.onLunch", { name, lunchTime }) : t("timeClock.status.user.onLunch", { lunchTime });
    } else if (clockStatus.clockedIn) {
        bannerStyle = styles.banner.clockedIn;
        bannerText = isOther ? t("timeClock.status.other.clockedIn", { name, clockInTime }) : t("timeClock.status.user.clockedIn", { clockInTime });
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
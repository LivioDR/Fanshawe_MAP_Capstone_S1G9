import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import { useTrialCountdown } from "../../services/state/trialCountdown";
import styles from "./styles";
import { useTheme } from "../../services/state/useTheme";
import {
    darkMode,
    lightMode,
    themeKey,
    darkBg,
    darkFont,
} from "../../services/themes/themes";

export default function TrialCountdownDisplay() {
    const { timeUntilExpiry, trialExpiryTimeString } = useTrialCountdown();

    // Language settings
    const { t, i18n } = useTranslation();

    // Theme settings
    const themes = getThemesList(t);
    const theme = useTheme();
    const isDarkMode = theme === darkMode;

    /*
  Making the date (ISO String) more readable
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  */
    const readableDate = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    }).format(new Date(trialExpiryTimeString));

    /*
  Calculations which convert the timeUntilExpiry, which is in seconds 
  to a more readable format for the user.
  Method from:
  https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
  */
    const days = Math.floor(timeUntilExpiry / (3600 * 24));
    const hours = Math.floor((timeUntilExpiry % (3600 * 24)) / 3600);
    const minutes = Math.floor((timeUntilExpiry % 3600) / 60);
    const seconds = Math.floor(timeUntilExpiry % 60);

    let readableTimeRemaining = `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;

    return (
        <View style={[styles.settingContainer, isDarkMode ? darkFont : {}]}>
            <Text style={[styles.heading, isDarkMode ? darkFont : {}]}>
                Trial Mode
            </Text>
            <Text style={[styles.subHeading, isDarkMode ? darkFont : {}]}>
                Your trial expires on:
            </Text>
            <Text style={[isDarkMode ? darkFont : {}]}>{readableDate}</Text>
            <Text style={[styles.subHeading, isDarkMode ? darkFont : {}]}>
                Time remaining:
            </Text>
            <Text style={[isDarkMode ? darkFont : {}]}>
                {readableTimeRemaining}
            </Text>
        </View>
    );

    function getThemesList(t) {
        return [
            {
                label: t("settings.themes.light"),
                value: lightMode,
            },
            {
                label: t("settings.themes.dark"),
                value: darkMode,
            },
        ];
    }
}

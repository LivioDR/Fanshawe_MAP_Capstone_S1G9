import i18next from "i18next";
import { View, Text } from "react-native";
import { useTrialCountdown } from "../../services/state/trialCountdown";
import styles from "./styles";
import { useTheme } from "../../services/state/useTheme";
import { darkMode, lightMode, darkFont } from "../../services/themes/themes";

export default function TrialCountdownDisplay() {
    const { timeUntilExpiry, trialExpiryTimeString } = useTrialCountdown();

    // Theme settings
    const theme = useTheme();
    const isDarkMode = theme === darkMode;

    /*
  Making the date (ISO String) more readable
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  */

    const readableDate = trialExpiryTimeString
        ? new Intl.DateTimeFormat(i18next.t("trial.date.locale"), {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
          }).format(new Date(trialExpiryTimeString))
        : i18next.t("errors.trial.noExpiryDateAvailable");

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

    let readableTimeRemaining = `${days} ${i18next.t("trial.date.days")}, ${hours} ${i18next.t("trial.date.hours")}, ${minutes} ${i18next.t("trial.date.minutes")}, ${i18next.t("trial.date.and")} ${seconds} ${i18next.t("trial.date.seconds")}.`;

    return (
        <View style={[styles.settingContainer, isDarkMode ? darkFont : {}]}>
            <Text style={[styles.heading, isDarkMode ? darkFont : {}]}>
            {i18next.t("trial.trialMode")}
            </Text>
            <Text style={[styles.subHeading, isDarkMode ? darkFont : {}]}>
            {i18next.t("trial.expiry.expiresOn")}:
            </Text>
            <Text style={[isDarkMode ? darkFont : {}]}>{readableDate}</Text>
            <Text style={[styles.subHeading, isDarkMode ? darkFont : {}]}>
            {i18next.t("trial.date.timeRemaining")}:
            </Text>
            <Text style={[isDarkMode ? darkFont : {}]}>
                {readableTimeRemaining} 
            </Text>
        </View>
    );
}

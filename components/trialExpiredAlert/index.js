import i18next from "i18next";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useTrialCountdown } from "../../services/state/trialCountdown";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

/*
This Alert component will listen for the change when isExpired is true.
It will then sign the user out from firebase.
It will then display the alert with the time when the trial is expired.

When OK is pressed the app will navigate to the login screen using the same logic
as the HomeScreen Log Out button, hence accepting the logOut prop from App.js
Note that no trialStateReset is needed here as this is passed included in the passed logOut prop.

When a user with an expired trial attempts to login, this alert is shown the first time they choose to do so

No UI other than the alert is rendered (hence return null)
*/

export default function TrialExpiredAlert({ logOut }) {
    const { trialExpiryTimeString, trialIsExpired } = useTrialCountdown();

    /*
    Making the date (ISO String) more readable
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

    A placeholder String is here just in case trialExpiryTimeString is undefined
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

    useEffect(() => {
        if (trialIsExpired) {
            (async () => {
                await signOut(auth).catch(() =>
                    Alert.alert(
                        i18next.t("errors.error"),
                        i18next.t("errors.trial.restartApp"),
                        [{ text: i18next.t("common.close") }]
                    )
                );
            })();
            Alert.alert(
                i18next.t("trial.expiry.expired"),
                `${i18next.t("trial.expiry.expiredOn")} ${readableDate}.`,
                [
                    {
                        text: i18next.t("common.close"),
                        onPress: () => {
                            logOut();
                        },
                    },
                ]
            );
        }
    }, [trialIsExpired]);

    return null;
}

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
  ? new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date(trialExpiryTimeString))  : "No date available";

    useEffect(() => {
        if (trialIsExpired) {
            (async () => {
                await signOut(auth).catch(() =>
                 console.log("Error signing out the user after trial expired")
                );
              })();
          Alert.alert("Trial Expired", `Your trial expired on ${readableDate}.\nYou will now be signed out.`, [{ text: "OK", onPress: () => {
            logOut();
          }}]);
        }
    }, [trialIsExpired]);

    return null;
  }
  
// Expo native support
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

// localization
import i18next from "i18next";
import { initI18next } from "./services/i18n/i18n";

// color scheme
import { themeKey } from "./services/themes/themes";

// React Native components
import { View, Appearance, Alert } from "react-native";

// auth
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

// hooks and providers
import { useEffect, useState } from "react";
import { PTOAdminProvider } from "./services/state/ptoAdmin";
import { ThemeProvider } from "./services/state/useTheme";
import { darkMode, darkBg } from "./services/themes/themes";

// database
import { getUserBioInfoById } from "./services/database/userBioInfo";

// custom components
import Toast from "react-native-toast-message";
import LoadingIndicator from "./components/common/LoadingIndicator";
import LoginScreen from "./screens/LoginScreen";
import AppScreen from "./screens/AppScreen";

import { TrialCountdownProvider } from "./services/state/trialCountdown";
import TrialExpiredAlert from "./components/trialExpiredAlert";

import AsyncStorage from "@react-native-async-storage/async-storage";
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [loadingTranslations, setLoadingTranslations] = useState(true);
    const [theme, setTheme] = useState(Appearance.getColorScheme());
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Asynchronously getting the stored theme and updating the Theme context provider
        (async () => {
            const colorScheme = await AsyncStorage.getItem(themeKey);
            if (colorScheme) {
                setTheme(colorScheme);
            }
        })();

        initI18next().then(() => {
            setLoadingTranslations(false);
        });

        // set up listener for reauth and login
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // if we have a user, check if they're disabled first
            if (user) {
                const userInfo = await getUserBioInfoById(user.uid);
                if (!userInfo.isEnabled) {
                    // not enabled, sign the user out
                    auth.signOut();
                    setLoggedIn(false);
                    SplashScreen.hideAsync(); // hide splash in case it's up

                    // show a toast
                    Toast.show({
                        type: "error",
                        text1: i18next.t("login.error", { icon: "🛑" }),
                        text2: i18next.t("errors.login.userDisabled"),
                        visibilityTime: 3000,
                        position: "bottom",
                    });
                } else {
                    setLoggedIn(true);
                }
            } else {
                setLoggedIn(false);
                SplashScreen.hideAsync();
            }
        });

        return unsubscribe;
    }, []);

    /**
     * Log the user out and return to the login screen.
     */
    const onLogout = () => {
        Alert.alert(
            i18next.t("login.logOut"),
            i18next.t("login.logOutConfirm"),
            [
                {
                    text: i18next.t("common.cancel"),
                    style: "cancel",
                    // no onPress, since cancel does nothing
                },
                {
                    text: i18next.t("common.accept"),
                    onPress: () => {
                        auth.signOut();
                    },
                },
            ]
        );
    };

    let shownScreen = loggedIn ? (
        <AppScreen logOut={onLogout} themeSetter={setTheme} />
    ) : (
        <LoginScreen />
    );
    if (loadingTranslations) {
        shownScreen = (
            <View
                style={[
                    { flex: 1, justifyContent: "center", alignItems: "center" },
                    theme === darkMode ? darkBg : {},
                ]}
            >
                <LoadingIndicator textOverride={"Loading..."} />
            </View>
        );
    }

    return (
        <TrialCountdownProvider>
            <PTOAdminProvider>
                <TrialExpiredAlert logOut={() => auth.signOut()} />
                <ThemeProvider userTheme={theme}>
                    <StatusBar style={theme === darkMode ? "light" : "dark"} />
                    {shownScreen}

                    <Toast />
                </ThemeProvider>
            </PTOAdminProvider>
        </TrialCountdownProvider>
    );
}

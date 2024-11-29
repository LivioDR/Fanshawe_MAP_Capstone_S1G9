// Expo native support
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

// localization
import i18next from 'i18next';
import { initI18next } from "./services/i18n/i18n";

// React Native components
import { Alert, View } from 'react-native';

// auth
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

// hooks and providers
import { useEffect, useState } from 'react';
import { PTOAdminProvider } from './services/state/ptoAdmin';

// database
import { getUserBioInfoById } from './services/database/userBioInfo';

// custom components
import Toast from "react-native-toast-message";
import LoadingIndicator from './components/common/LoadingIndicator';
import LoginScreen from './screens/LoginScreen';
import AppScreen from './screens/AppScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [loadingTranslations, setLoadingTranslations] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
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
                    SplashScreen.hideAsync();   // hide splash in case it's up

                    // show a toast
                    Toast.show({
                        type: "error",
                        text1: i18next.t("login.error", { icon: "🛑" }),
                        text2: i18next.t("errors.login.userDisabled"),
                        visibilityTime: 2200,
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
        Alert.alert(i18next.t("login.logOut"), i18next.t("login.logOutConfirm"), [
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
        ]);
    };

    let shownScreen = loggedIn ? <AppScreen logOut={onLogout} /> : <LoginScreen />;
    if (loadingTranslations) {
        shownScreen = (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <LoadingIndicator textOverride={"Loading..."} />
            </View>
        );
    }

    return (
        <PTOAdminProvider>

            <StatusBar style="auto" />
            {shownScreen}

            <Toast />

        </PTOAdminProvider>
    );
}
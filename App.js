// Expo native support
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

// localization
import { initI18next } from "./services/i18n/i18n";
import { useTranslation } from 'react-i18next';

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

    // we can use the hook for translation instead of i18next.t because we wait to render anything
    // in the useEffect hook
    // so the user will not be able to do anything that requires translated strings
    const { t } = useTranslation();

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
                        text1: t("login.error", { icon: "🛑" }),
                        text2: t("errors.login.userDisabled"),
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
        Alert.alert(t("login.logOut"), t("login.logOutConfirm"), [
            {
                text: t("common.cancel"),
                style: "cancel",
                // no onPress, since cancel does nothing
            },
            {
                text: t("common.accept"),
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
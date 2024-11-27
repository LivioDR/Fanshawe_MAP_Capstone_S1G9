// Expo native support
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

// localization
import { initI18next } from "./services/i18n/i18n";

// React Native components
import { Alert, View } from 'react-native';

// auth
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

// hooks and providers
import { useEffect, useState } from 'react';
import { PTOAdminProvider } from './services/state/ptoAdmin';

// custom components
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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // if we have a user, show app screen
            if (user) {
                setLoggedIn(true);
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
        Alert.alert("Log Out", "Are you sure you wish to log out?", [
            {
                text: "Cancel",
                style: "cancel",
                // no onPress, since cancel does nothing
            },
            {
                text: "Log Out",
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

        </PTOAdminProvider>
    );
}
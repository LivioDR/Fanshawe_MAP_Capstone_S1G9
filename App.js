// Expo status bar
import { StatusBar } from 'expo-status-bar';

// localization
import { initI18next } from "./services/i18n/i18n";

// React Native components
import { View } from 'react-native';

// hooks and providers
import { useEffect, useState } from 'react';
import { CredentialProvider } from './services/state/userCredentials';
import { PTOAdminProvider } from './services/state/ptoAdmin';

// custom components
import LoadingIndicator from './components/common/LoadingIndicator';
import LoginScreen from './screens/LoginScreen';
import AppScreen from './screens/AppScreen';
import { TrialCountdownProvider } from './services/state/trialCountdown';

export default function App() {
    const [loadingTranslations, setLoadingTranslations] = useState(true);
    const [loginCredential, setLoginCredential] = useState(null);

    useEffect(() => {
        initI18next().then(() => {
            setLoadingTranslations(false);
        });
    }, []);

    /**
     * Save credentials returned from logging in.
     * @param {AuthCredential} credential auth credentials from login
     */
    const onLogin = (credential) => {
        setLoginCredential(credential);
    };

    /**
     * Log the user out and return to the login screen.
     */
    const onLogout = () => {
        setLoginCredential(null);
    };

    let shownScreen = loginCredential ? <AppScreen logOut={onLogout} /> : <LoginScreen loginSuccess={onLogin} />;
    if (loadingTranslations) {
        shownScreen = (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <LoadingIndicator textOverride={"Loading..."} />
            </View>
        );
    }

    return (
        <TrialCountdownProvider>
        <PTOAdminProvider>
        <CredentialProvider userCreds={loginCredential}>

            <StatusBar style="auto" />
            {shownScreen}

        </CredentialProvider>
        </PTOAdminProvider>
        </TrialCountdownProvider>
    );
}
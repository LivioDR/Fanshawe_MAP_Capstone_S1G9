// Expo status bar
import { StatusBar } from 'expo-status-bar';

// localization
import { initI18next } from "./services/i18n/i18n";

// color scheme
import { themeKey } from './services/themes/themes';

// React Native components
import { View, Appearance } from 'react-native';

// hooks and providers
import { useEffect, useState } from 'react';
import { CredentialProvider } from './services/state/userCredentials';
import { PTOAdminProvider } from './services/state/ptoAdmin';
import { ThemeProvider } from './services/state/useTheme';
import { darkMode, darkBg } from './services/themes/themes';

// custom components
import LoadingIndicator from './components/common/LoadingIndicator';
import LoginScreen from './screens/LoginScreen';
import AppScreen from './screens/AppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const [loadingTranslations, setLoadingTranslations] = useState(true);
    const [loginCredential, setLoginCredential] = useState(null);
    const [theme, setTheme] = useState(Appearance.getColorScheme())

    useEffect(() => {

        // Asynchronously getting the stored theme and updating the Theme context provider
        (async()=>{
            const colorScheme = await AsyncStorage.getItem(themeKey)
            if(colorScheme){
                setTheme(colorScheme)
            }
        })()

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

    let shownScreen = loginCredential ? <AppScreen logOut={onLogout} themeSetter={setTheme} /> : <LoginScreen loginSuccess={onLogin} />;
    if (loadingTranslations) {
        shownScreen = (
            <View style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, theme === darkMode ? darkBg : {}]}>
                <LoadingIndicator textOverride={"Loading..."} />
            </View>
        );
    }

    return (
        <ThemeProvider userTheme={theme}>
        <PTOAdminProvider>
        <CredentialProvider userCreds={loginCredential}>

            <StatusBar style="auto" />
            {shownScreen}

        </CredentialProvider>
        </PTOAdminProvider>
        </ThemeProvider>
    );
}
// Expo status bar
import { StatusBar } from 'expo-status-bar';

// hooks and providers
import { useState } from 'react';
import { CredentialProvider } from './services/state/userCredentials';
import { UserBioInfoProvider } from './services/state/userBioInfo';
import { TimeLogProvider } from './services/state/timeClock';

// custom components
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
    const [loginCredential, setLoginCredential] = useState(null);

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

    const shownScreen = loginCredential ? <HomeScreen logOut={onLogout} /> : <LoginScreen loginSuccess={onLogin} />;

    return (
        <CredentialProvider userCreds={loginCredential}>
        <UserBioInfoProvider>
        <TimeLogProvider>

            <StatusBar style="auto" />
            {shownScreen}

        </TimeLogProvider>
        </UserBioInfoProvider>
        </CredentialProvider>
    );
}
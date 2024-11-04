// Expo status bar
import { StatusBar } from 'expo-status-bar';

// hooks and providers
import { useState } from 'react';
import { Provider } from 'react-redux';
import store from './services/state/store';
import { CredentialProvider } from './utilities/userCredentialUtils';

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
        <Provider store={store}>
        <CredentialProvider userCreds={loginCredential}>

            <StatusBar style="auto" />
            {shownScreen}
            
        </CredentialProvider>
        </Provider>
    );
}
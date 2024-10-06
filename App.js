// Expo status bar
import { StatusBar } from 'expo-status-bar';

// hooks
import { useState } from 'react';

// custom components
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
    const [loginCredential, setLoginCredential] = useState(null);

    const onLogin = (credential) => {
        console.log(credential);
        setLoginCredential(credential);
    };

    const shownScreen = loginCredential ? <HomeScreen /> : <LoginScreen loginSuccess={onLogin} />;

    return (
        <>
            <StatusBar style="auto" />
            {shownScreen}
        </>
    );
}
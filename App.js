// Expo status bar
import { StatusBar } from 'expo-status-bar';

// RN elements
import { StyleSheet, Text, View } from 'react-native';

// navigation
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// hooks
import { useState } from 'react';

// icons
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// custom components
import HomeScreen from './screens/HomeScreen';
import UserBio from "./screens/UserBioScreen/UserBio";

// theme variables
import { accent, highlight } from './utilities/variables';
import LoginScreen from './screens/LoginScreen';

// create bottom tab navigator elements
const Tab = createBottomTabNavigator();

const NavTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#FFF",
    }
};

// TODO: replace these placeholder components with screen components from screens
function CompanyScreenPlaceholder() {
    return (
        <View style={styles.container}>
            <Text>Company Screen</Text>
        </View>
    );
}

export default function App() {
    const [loginCredential, setLoginCredential] = useState(null);

    const onLogin = (credential) => {
        console.log(credential);
        setLoginCredential(credential);
    };

    if (loginCredential) {
        return (
            <NavigationContainer theme={NavTheme}>
                <StatusBar style="auto" />
    
                <Tab.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: false,
                        tabBarActiveTintColor: accent,
                        tabBarStyle: {
                            backgroundColor: highlight,
                        },
                    }}
                >
                    <Tab.Screen
                        name="Company"
                        component={CompanyScreenPlaceholder}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialIcons
                                    name="apartment"
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />
    
                    <Tab.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                                <MaterialCommunityIcons
                                    name={focused ? "home-variant" : "home-variant-outline"}
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />
    
                    <Tab.Screen
                        name="Profile"
                        component={UserBio}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                                <MaterialIcons
                                    name={focused ? "person" : "person-outline"}
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        );
    } else {
        return <LoginScreen loginSuccess={onLogin} />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

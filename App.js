import { StatusBar } from 'expo-status-bar';

import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// create bottom tab navigator elements
const Tab = createBottomTabNavigator();

// TODO: replace this with an auth variable of some sort
const loggedIn = true;

// TODO: replace these placeholder components with screen components from screens/
function HomeScreenPlaceholder() {
    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
        </View>
    );
}
function CompanyScreenPlaceholder() {
    return (
        <View style={styles.container}>
            <Text>Company Screen</Text>
        </View>
    );
}
function ProfileScreenPlaceholder() {
    return (
        <View style={styles.container}>
            <Text>Profile Screen</Text>
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="auto" />

            <Tab.Navigator initialRouteName="Home">
                <Tab.Screen name="Company" component={CompanyScreenPlaceholder} />

                <Tab.Screen name="Home" component={HomeScreenPlaceholder} />

                <Tab.Screen name="Profile" component={ProfileScreenPlaceholder} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

// Expo status bar
import { StatusBar } from 'expo-status-bar';

// RN elements
import { StyleSheet, Text, View } from 'react-native';

// navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// icons
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// create bottom tab navigator elements
const Tab = createBottomTabNavigator();

// TODO: replace this with an auth variable of some sort
const loggedIn = true;

// TODO: replace this with a value retrieved from the DB
const isAdmin = true;
const userId = 'super1234';

import UserBio from './screens/UserBioScreen/UserBio';
import AdminView from './screens/AdminView/AdminView';

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
        // <View style={styles.container}>
        //     <Text>Profile Screen</Text>
        // </View>
        <UserBio userId={userId}/>
    );
}
function TeamScreenPlaceholder() {
    return (
        // <View style={styles.container}>
        //     <Text>Team Screen</Text>
        // </View>
        <AdminView uid={userId}/>
    )
}

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="auto" />

            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
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
                    component={HomeScreenPlaceholder}
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

                {
                isAdmin &&
                <Tab.Screen
                    name="Team"
                    component={TeamScreenPlaceholder}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <MaterialCommunityIcons
                                name={focused ? "account-multiple" : "account-multiple-outline"}
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                }

                <Tab.Screen
                    name="Profile"
                    component={ProfileScreenPlaceholder}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

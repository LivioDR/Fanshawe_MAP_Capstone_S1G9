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

import UserBio from '../UserBioScreen/UserBio';
import AdminView from '../AdminView/AdminView';

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

export default function HomeScreen({userId, isAdmin}) {
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
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <MaterialCommunityIcons
                                name={focused ? "account-multiple" : "account-multiple-outline"}
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                >
                    {()=><AdminView uid={userId}/>}
                </Tab.Screen>
                }

                <Tab.Screen
                    name="Profile"
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <MaterialIcons
                                name={focused ? "person" : "person-outline"}
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                >
                    {() => <UserBio userId={userId}/>}
                </Tab.Screen>
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

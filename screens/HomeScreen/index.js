// RN elements
import { Text, View } from "react-native";

// navigation
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// icons
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// custom components
import TimeClockScreen from "../TimeClockScreen";
import UserBio from "../UserBioScreen/UserBio";

// theme variables
import { accent, highlight } from "../../utilities/variables";

// custom styles
import styles from "./styles";

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

export default function HomeScreen() {
    return (
        <NavigationContainer theme={NavTheme}>
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
                    component={TimeClockScreen}
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
}
// localization
import { useTranslation } from "react-i18next";

// navigation
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// icons
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// custom components
import CompanyScreen from "../CompanyScreen";
import HomeScreen from "../HomeScreen";
import UserBio from "../UserBioScreen/UserBio";

// theme variables
import { accent, highlight } from "../../utilities/variables";

// create bottom tab navigator elements
const Tab = createBottomTabNavigator();

const NavTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#FFF",
    }
};

export default function AppScreen({ logOut }) {
    const { t } = useTranslation();

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
                    component={CompanyScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons
                                name="apartment"
                                size={size}
                                color={color}
                            />
                        ),
                        tabBarLabel: t("common.nav.company"),
                    }}
                />

                <Tab.Screen
                    name="Home"
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <MaterialCommunityIcons
                                name={focused ? "home-variant" : "home-variant-outline"}
                                size={size}
                                color={color}
                            />
                        ),
                        tabBarLabel: t("common.nav.home"),
                    }}
                >
                    {() => <HomeScreen logOut={logOut} />}
                </Tab.Screen>

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
                        tabBarLabel: t("common.nav.profile"),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
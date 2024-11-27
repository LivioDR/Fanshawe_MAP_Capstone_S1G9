// localization
import { useTranslation } from "react-i18next";

// navigation
import { DefaultTheme, DarkTheme, NavigationContainer } from "@react-navigation/native";
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
import { useTheme } from "../../services/state/useTheme";
import { darkBg, darkFont, darkMode } from "../../services/themes/themes";

// create bottom tab navigator elements
const Tab = createBottomTabNavigator();


export default function AppScreen({ logOut, themeSetter }) {
    const { t } = useTranslation();
    const theme = useTheme()
    const isDarkMode = theme === darkMode
    const NavTheme = {
        ...DefaultTheme,
        colors: isDarkMode ?
        {
            ...DarkTheme.colors,
            background: darkBg.backgroundColor,
            text: darkFont.color,
        } :
        {
            ...DefaultTheme.colors,
            background: "#FFF",
        }
    };
    
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
                    {() => <HomeScreen logOut={logOut} themeSetter={themeSetter} />}
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
// localization
import { useTranslation } from "react-i18next";

// RN elements
import { Button } from "react-native";

// navigation
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// icons
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// custom components
import CompanyScreen from "../CompanyScreen";
import TimeClockScreen from "../TimeClockScreen";
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

export default function HomeScreen({ logOut }) {
    const { t } = useTranslation();

    return (
        <NavigationContainer theme={NavTheme}>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerTitle: "",
                    headerLeft: () => (
                        <Button
                            onPress={logOut}
                            title={t("common.logOut")}
                            color={accent}
                        />
                    ),
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
                        headerShown: false,
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
                    component={TimeClockScreen}
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
                />

                <Tab.Screen
                    name="Profile"
                    component={UserBio}
                    options={{
                        headerShown: false,
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
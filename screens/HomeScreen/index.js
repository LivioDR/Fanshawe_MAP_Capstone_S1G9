import { useTranslation } from "react-i18next";

import { TouchableHighlight, Text } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import TimeClockScreen from "../TimeClockScreen";
import SettingsScreen from "../SettingsScreen";

import { useTrialCountdown } from "../../services/state/trialCountdown";

import { highlight, accent } from "../../utilities/variables";
import styles from "./styles";

const Stack = createStackNavigator();

export default function HomeScreen({ logOut }) {
    const nav = useNavigation();
    const { t } = useTranslation();
 
    return (
        <Stack.Navigator
            initialRouteName="TimeClock"
            screenOptions={{
                headerBackTitle: t("common.nav.back"),
            }}
        >
            <Stack.Screen 
                name="TimeClock"
                component={TimeClockScreen}
                options={{
                    headerTitle: "",
                    headerLeft: () => (
                        <TouchableHighlight
                            onPress={logOut}
                            style={[styles.barButton, styles.btnLeft]}
                            underlayColor={highlight}
                        >
                            <Text style={styles.btnText}>{t("common.logOut")}</Text>
                        </TouchableHighlight>
                    ),
                    headerRight: () => (
                        <TouchableHighlight
                            onPress={() => nav.navigate("Settings")}
                            style={[styles.barButton, styles.btnRight]}
                            underlayColor={highlight}
                        >
                            <MaterialIcons
                                name="settings"
                                size={24}
                                color={accent}
                            />
                        </TouchableHighlight>
                    ),
                }}
            />

            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    headerTitle: t("common.nav.settings"),
                }}
            />
        </Stack.Navigator>
    );
}
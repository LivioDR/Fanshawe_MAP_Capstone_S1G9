import React from "react";

import { FlatList, Text, TouchableHighlight, View } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { highlight, lightDropShadowStyle } from "../../utilities/variables";
import styles from "./styles";

// create stack nav
const Stack = createStackNavigator();

const options = [
    {
        caption: "My Team",
        destination: "MyTeamScreen",
        icon: <MaterialIcons name="people" size={30} color="black" />,
    },
];

// placeholder options screen component
// TODO: factor out into separate file
function CompanyOptions() {
    return (
        <View style={styles.container}>
            <FlatList
                data={options}
                renderItem={(item) => <CompanyOptionSelector {...item.item} />}
                contentContainerStyle={{ gap: 15 }}
            />
        </View>
    );
}

// placeholder option component
// TODO: factor out into separate file
function CompanyOptionSelector({ caption, icon = <></>, destination }) {
    const navigation = useNavigation();

    return (
        <TouchableHighlight
            style={{
                position: "relative",
                minWidth: "100%",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                paddingHorizontal: icon.type && icon.type === React.Fragment ? 12 : 54,
                borderRadius: 10,
                backgroundColor: highlight,
                ...lightDropShadowStyle,
            }}
            onPress={() => {
                navigation.navigate(destination);
            }}
            underlayColor="#E6E6E6"
        >
            <>
                <View style={{
                    position: "absolute",
                    left: 12,
                }}>
                    {icon}
                </View>
                <Text style={{ fontSize: 17, textAlign: "center" }}>{caption}</Text>
            </>
        </TouchableHighlight>
    );
}

export default function CompanyScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CompanyOptions"
                component={CompanyOptions}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="MyTeamScreen"
                options={{
                    headerTitle: "My Team",
                }}
            >
                {(_) => <Text>My Team</Text>}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
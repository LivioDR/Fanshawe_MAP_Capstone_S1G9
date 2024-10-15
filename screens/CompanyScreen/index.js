import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import CompanyOptions from "../../components/companyOptions/CompanyOptions";
import AdminView from "../AdminView/AdminView";

// create stack nav
const Stack = createStackNavigator();

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
                {(_) => <AdminView uid="OchvNvfoYwfC02lEumRAJKR9PA03" />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
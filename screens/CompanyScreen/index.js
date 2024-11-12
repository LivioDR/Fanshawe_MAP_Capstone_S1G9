import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import CompanyOptions from "../../components/companyOptions/CompanyOptions";
import TeamScreen from "../TeamScreen/TeamScreen";
import UserBio from "../UserBioScreen/UserBio";
import ManageTeamScreen from "../ManageTeamScreen/ManageTeamScreen";

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
                component={TeamScreen}
                options={{
                    headerTitle: "My Team",
                }}
            />

            <Stack.Screen
                name="ManageTeamScreen"
                component={ManageTeamScreen}
                options={{
                    headerTitle: "Manage Team",
                }}
            />

            <Stack.Screen
                name="TeamMemberDetails"
                component={UserBio}
                options={{
                    headerTitle: "Team Member Details",
                }}
            />
        </Stack.Navigator>
    );
}
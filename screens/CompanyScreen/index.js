import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import CompanyOptions from "../../components/companyOptions/CompanyOptions";
import AdminView from "../AdminView/AdminView";
import UserBio from "../UserBioScreen/UserBio";
import { useCredentials } from "../../utilities/userCredentialUtils";

// create stack nav
const Stack = createStackNavigator();

export default function CompanyScreen() {
    const userCreds = useCredentials();
    const authUserId = userCreds.user.uid;

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
                {(_) => <AdminView uid={authUserId} />}
            </Stack.Screen>

            <Stack.Screen
                name="TeamMemberDetails"
                options={{
                    headerTitle: "Team Member Details",
                }}
            >
                {({ route }) => <UserBio userId={route.params.id} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
import { useTranslation } from "react-i18next";

import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import CompanyOptions from "../../components/companyOptions/CompanyOptions";
import TeamScreen from "../TeamScreen/TeamScreen";
import UserBio from "../UserBioScreen/UserBio";
import ManageTeamScreen from "../ManageTeamScreen/ManageTeamScreen";
import NewMemberScreen from "../NewMemberScreen/NewMemberScreen";

// create stack nav
const Stack = createStackNavigator();

export default function CompanyScreen() {
    const { t } = useTranslation();

    return (
        <Stack.Navigator
            initialRouteName="CompanyOptions"
            screenOptions={{
                headerBackTitle: t("common.nav.back"),
            }}
        >
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
                    headerTitle: t("team.myTeam"),
                }}
            />

            <Stack.Screen
                name="ManageTeamScreen"
                component={ManageTeamScreen}
                options={{
                    headerTitle: t("team.manageTeam"),
                }}
            />

            <Stack.Screen
                name="AddMemberScreen"
                component={NewMemberScreen}
                options={{
                    headerTitle: t("team.addMemberTitle"),
                }}
            />

            <Stack.Screen
                name="TeamMemberDetails"
                component={UserBio}
                options={{
                    headerTitle: t("team.memberDetails"),
                }}
            />
        </Stack.Navigator>
    );
}
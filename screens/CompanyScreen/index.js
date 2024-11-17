import { useTranslation } from "react-i18next";

import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import CompanyOptions from "../../components/companyOptions/CompanyOptions";
import TeamScreen from "../TeamScreen/TeamScreen";
import UserBio from "../UserBioScreen/UserBio";
import ManageTeamScreen from "../ManageTeamScreen/ManageTeamScreen";
import NewMemberScreen from "../NewMemberScreen/NewMemberScreen";
import PTOTeamScreen from "../PTOTeamScreen/PTOTeamScreen";
import PTOEditScreen from "../PTOEditScreen/PTOEditScreen";

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

            <Stack.Screen
                name="PTOTeamScreen"
                component={PTOTeamScreen}
                options={{
                    headerTitle: "Manage Team PTO",
                }}
            />

            <Stack.Screen
                name="PTOEditScreen"
                component={PTOEditScreen}
                options={{
                    headerTitle: "Edit PTO",
                }}
            />
        </Stack.Navigator>
    );
}
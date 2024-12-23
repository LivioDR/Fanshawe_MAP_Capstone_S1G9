import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { View, FlatList } from "react-native";

import { auth } from "../../../config/firebase";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { getUserBioInfoById } from "../../../services/database/userBioInfo";

import LoadingIndicator from "../../common/LoadingIndicator";
import CompanyOptionSelector from "./CompanyOptionSelector";

import { useTheme } from "../../../services/state/useTheme"
import styles from "./styles";
import { darkMode, darkBg } from "../../../services/themes/themes"


export default function CompanyOptions() {
    const userId = auth.currentUser.uid;
    const { t } = useTranslation();

    const theme = useTheme()
    const isDarkMode = theme == darkMode

    const options = [
        {
            caption: t("team.myTeam"),
            destination: "MyTeamScreen",
            icon: <MaterialIcons name="people" size={30} color="black" />,
        },
    ];

    const adminOptions = [
        {
            caption: t("team.manageTeam"),
            destination: "ManageTeamScreen",
            icon: <MaterialIcons name="cases" size={30} color="black" />,
        },
        {
            caption: t("team.managePTO"),
            destination: "PTOTeamScreen",
            icon: <MaterialIcons name="edit-calendar" size={30} color="black" />,
        },
        {
            caption: t("team.addMemberTitle"),
            destination: "AddMemberScreen",
            icon: <MaterialIcons name="group-add" size={30} color="black" />,
        },
    ];
    
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        (async () => {
            const userBio = await getUserBioInfoById(userId);
            if (userBio) {
                setIsAdmin(userBio.isSupervisor);
            }
            setLoading(false);
        })();
    }, []);

    if (loading) return (
        <View style={[styles.container, isDarkMode ? darkBg : {}]}>
            <LoadingIndicator />
        </View>
    );

    return (
        <View style={[styles.container, isDarkMode ? darkBg : {}]}>
            <FlatList
                data={isAdmin ? [...options, ...adminOptions] : options}
                renderItem={(item) => <CompanyOptionSelector {...item.item} />}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { View, FlatList } from "react-native";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useCredentials } from "../../../services/state/userCredentials";
import { getUserBioInfoById } from "../../../services/database/userBioInfo";

import LoadingIndicator from "../../common/LoadingIndicator";
import CompanyOptionSelector from "./CompanyOptionSelector";

import styles from "./styles";

export default function CompanyOptions() {
    const userCredentials = useCredentials();
    const { t } = useTranslation();

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
            const userBio = await getUserBioInfoById(userCredentials.user.uid);
            if (userBio) {
                setIsAdmin(userBio.isSupervisor);
            }
            setLoading(false);
        })();
    }, []);

    if (loading) return (
        <View style={styles.container}>
            <LoadingIndicator />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={isAdmin ? [...options, ...adminOptions] : options}
                renderItem={(item) => <CompanyOptionSelector {...item.item} />}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}
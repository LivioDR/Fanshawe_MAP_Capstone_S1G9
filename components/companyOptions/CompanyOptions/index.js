import { useTranslation } from "react-i18next";

import { View, FlatList } from "react-native";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useCredentials } from "../../../services/state/userCredentials";
import { useBioInfo } from "../../../services/state/userBioInfo";

import CompanyOptionSelector from "./CompanyOptionSelector";

import styles from "./styles";

export default function CompanyOptions() {
    const userCredentials = useCredentials();
    const userBios = useBioInfo();
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
            caption: t("team.addMember"),
            destination: "AddMemberScreen",
            icon: <MaterialIcons name="group-add" size={30} color="black" />,
        },
    ];

    let isUserAdmin = userBios.bios[userCredentials.user.uid].isSupervisor

    return (
        <View style={styles.container}>
            <FlatList
                data={isUserAdmin? [...options, ...adminOptions] : options}
                renderItem={(item) => <CompanyOptionSelector {...item.item} />}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}
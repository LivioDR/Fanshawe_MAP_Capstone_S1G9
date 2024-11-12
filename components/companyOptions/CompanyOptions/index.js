import { useTranslation } from "react-i18next";

import { View, FlatList } from "react-native";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import CompanyOptionSelector from "./CompanyOptionSelector";

import styles from "./styles";

export default function CompanyOptions() {
    const { t } = useTranslation();

    const options = [
        {
            caption: t("team.myTeam"),
            destination: "MyTeamScreen",
            icon: <MaterialIcons name="people" size={30} color="black" />,
        },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={options}
                renderItem={(item) => <CompanyOptionSelector {...item.item} />}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}
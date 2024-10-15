import { View, FlatList } from "react-native";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import CompanyOptionSelector from "../CompanyOptionSelector";

import styles from "./styles";

const options = [
    {
        caption: "My Team",
        destination: "MyTeamScreen",
        icon: <MaterialIcons name="people" size={30} color="black" />,
    },
];

export default function CompanyOptions() {
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
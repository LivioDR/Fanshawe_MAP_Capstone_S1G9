import { View, FlatList } from "react-native";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import CompanyOptionSelector from "./CompanyOptionSelector";

import styles from "./styles";

import { useCredentials } from "../../../services/state/userCredentials";
import { useBioInfo } from "../../../services/state/userBioInfo";


const options = [
    {
        caption: "My Team",
        destination: "MyTeamScreen",
        icon: <MaterialIcons name="people" size={30} color="black" />,
    },
];

const adminOptions = [
    {
        caption: "My Team",
        destination: "MyTeamScreen",
        icon: <MaterialIcons name="people" size={30} color="black" />,
    },
    {
        caption: "Manage Team",
        destination: "ManageTeamScreen",
        icon: <MaterialIcons name="cases" size={30} color="black" />,
    },
    {
        caption: "Add members",
        destination: "AddMemberScreen",
        icon: <MaterialIcons name="group-add" size={30} color="black" />,
    },
];

export default function CompanyOptions() {
    
    const userCredentials = useCredentials()
    const userBios = useBioInfo()

    let isUserAdmin = userBios.bios[userCredentials.user.uid].isSupervisor

    return (
        <View style={styles.container}>
            <FlatList
                data={isUserAdmin? adminOptions : options}
                renderItem={(item) => <CompanyOptionSelector {...item.item} />}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}
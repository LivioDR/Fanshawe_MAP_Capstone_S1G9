import { useEffect, useState } from "react";

import { View, FlatList } from "react-native";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useCredentials } from "../../../services/state/userCredentials";
import { getUserBioInfoById } from "../../../services/database/userBioInfo";

import LoadingIndicator from "../../common/LoadingIndicator";
import CompanyOptionSelector from "./CompanyOptionSelector";

import styles from "./styles";


const options = [
    {
        caption: "My Team",
        destination: "MyTeamScreen",
        icon: <MaterialIcons name="people" size={30} color="black" />,
    },
];

const adminOptions = [
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
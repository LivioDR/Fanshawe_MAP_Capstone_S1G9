import React from "react";

import { TouchableHighlight, View, Text } from "react-native";

import { useNavigation } from "@react-navigation/native";

import styles from "./styles";

export default function CompanyOptionSelector({ caption, icon = <></>, destination }) {
    const navigation = useNavigation();

    return (
        <TouchableHighlight
            style={[
                styles.container,
                {
                    paddingHorizontal: icon.type && icon.type === React.Fragment ? 12 : 54,
                },
            ]}
            onPress={() => navigation.navigate(destination)}
            underlayColor="#E6E6E6"
        >
            <>
                <View style={styles.iconContainer}>
                    {icon}
                </View>
                <Text style={styles.caption}>{caption}</Text>
            </>
        </TouchableHighlight>
    );
}
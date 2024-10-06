import React from "react";
import PtoCounter from "./PtoCounter/PtoCounter";
import styles from "./AvailablePTOStyles";
import { View } from "react-native";

const AvailablePTO = ({numPto, numSick}) => {
    return(
        <View style={styles.container}>
            <PtoCounter title={'PTO days remaining'} value={numPto}/>
            <PtoCounter title={'Sick days remaining'} value={numSick} />
        </View>
    )
}
export default AvailablePTO
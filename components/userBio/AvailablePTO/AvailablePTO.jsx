import { useTranslation } from "react-i18next";
import React from "react";
import PtoCounter from "./PtoCounter/PtoCounter";
import styles from "./AvailablePTOStyles";
import { View } from "react-native";

const AvailablePTO = ({numPto, numSick}) => {
    const { t } = useTranslation()

    return(
        <View style={styles.container}>
            <PtoCounter title={t("profile.pto.ptoRemaining")} value={numPto}/>
            <PtoCounter title={t("profile.pto.sickRemaining")} value={numSick} />
        </View>
    )
}
export default AvailablePTO
import { View, Text, TouchableHighlight } from "react-native";

import UiButton from "../../common/UiButton/UiButton";

import styles from "./styles";

export default function ClockButtons({ clockStatus, actions = {} }) {
    return (
        <View style={styles.container}>
            <UiButton
                label="Clock In"
                disabled={clockStatus.clockedIn}
                funcToCall={"clockIn" in actions ? actions.clockIn : undefined}
                type="confirm"
            />
            <UiButton
                label="Clock Out"
                disabled={!clockStatus.clockedIn}
                funcToCall={"clockOut" in actions ? actions.clockOut : undefined}
                type="warning"
            />
            <UiButton
                label="Start Lunch"
                disabled={clockStatus.takenLunch || (!clockStatus.clockedIn || clockStatus.onLunch)}
                funcToCall={"startLunch" in actions ? actions.startLunch : undefined}
                type="primary"
            />
            <UiButton
                label="End Lunch"
                disabled={!(clockStatus.clockedIn && clockStatus.onLunch)}
                funcToCall={"endLunch" in actions ? actions.endLunch : undefined}
                type="warning"
            />
        </View>
    );
}
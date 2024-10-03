import { View, Text, TouchableHighlight } from "react-native";

import UiButton from "../../common/UiButton/UiButton";

import styles from "./styles";

export default function ClockButtons({ clockStatus, dispatch }) {
    return (
        <View style={styles.container}>
            <UiButton
                label="Clock In"
                disabled={clockStatus.clockedIn}
                funcToCall={() => dispatch({ type: "clockIn" })}
                type="confirm"
            />
            <UiButton
                label="Clock Out"
                disabled={!clockStatus.clockedIn}
                funcToCall={() => dispatch({ type: "clockOut" })}
                type="warning"
            />
            <UiButton
                label="Start Lunch"
                disabled={clockStatus.takenLunch || (!clockStatus.clockedIn || clockStatus.onLunch)}
                funcToCall={() => dispatch({ type: "startLunch" })}
                type="primary"
            />
            <UiButton
                label="End Lunch"
                disabled={!(clockStatus.clockedIn && clockStatus.onLunch)}
                funcToCall={() => dispatch({ type: "endLunch" })}
                type="warning"
            />
        </View>
    );
}
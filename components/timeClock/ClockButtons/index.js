import { View, Text, TouchableHighlight } from "react-native";

import styles from "./styles";

export default function ClockButtons({ clockStatus, dispatch }) {
    return (
        <View style={styles.container}>
            {/* TODO: replace with a custom shadowed button component */}
            <TouchableHighlight
                style={[
                    styles.clockBtn,
                    clockStatus.clockedIn ? undefined : styles.clockBtn.green
                ]}
                underlayColor="#DDD"
                disabled={clockStatus.clockedIn}
                onPress={() => dispatch({ type: "clockIn" })}
            >
                <Text style={styles.clockBtn.text}>Clock In</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={[
                    styles.clockBtn,
                    !clockStatus.clockedIn ? undefined : styles.clockBtn.red
                ]}
                underlayColor="#DDD"
                disabled={!clockStatus.clockedIn}
                onPress={() => dispatch({ type: "clockOut" })}
            >
                <Text style={styles.clockBtn.text}>Clock Out</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={[
                    styles.clockBtn,
                    clockStatus.takenLunch || (!clockStatus.clockedIn || clockStatus.onLunch) ?
                        undefined :
                        styles.clockBtn.blue
                ]}
                underlayColor="#DDD"
                disabled={clockStatus.takenLunch || (!clockStatus.clockedIn || clockStatus.onLunch)}
                onPress={() => dispatch({ type: "startLunch" })}
            >
                <Text style={styles.clockBtn.text}>Start Lunch</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={[
                    styles.clockBtn,
                    !(clockStatus.clockedIn && clockStatus.onLunch) ? undefined : styles.clockBtn.red
                ]}
                underlayColor="#DDD"
                disabled={!(clockStatus.clockedIn && clockStatus.onLunch)}
                onPress={() => dispatch({ type: "endLunch" })}
            >
                <Text style={styles.clockBtn.text}>End Lunch</Text>
            </TouchableHighlight>
        </View>
    );
}
// React hooks
import { useReducer } from "react";

// RN components
import { Image, Text, TouchableHighlight, View } from "react-native";

// custom components
import ClockStatusBanner from "../../components/timeClock/ClockStatusBanner";

// styles
import styles from "./styles";

export default function HomeScreen() {
    // manage state with a reducer to easily handle sub-values
    const initState = {
        clockedIn: false,
        onLunch: false,
        takenLunch: false,
    };
    const reducer = (state, action) => {
        switch (action.type) {
            case "clockIn":
                return {
                    clockedIn: true,
                    onLunch: state.onLunch,
                    takenLunch: state.takenLunch,
                };
            
            case "clockOut":
                return {
                    clockedIn: false,
                    onLunch: false,
                    takenLunch: false,
                };
            
            case "startLunch":
                return {
                    clockedIn: state.clockedIn,
                    onLunch: true,
                    takenLunch: true,
                };
            
            case "endLunch":
                return {
                    clockedIn: state.clockedIn,
                    onLunch: false,
                    takenLunch: state.takenLunch,
                };
        }
    };
    const [clockStatus, dispatch] = useReducer(reducer, initState);

    return (
        <View style={styles.container.outer}>
            <ClockStatusBanner
                clockedIn={clockStatus.clockedIn}
                onLunch={clockStatus.onLunch}
            />

            <View style={styles.container.inner}>
                <View style={styles.container.intro}>
                    <View style={styles.container.image}>
                        <Image
                            style={styles.profileImage}
                            source={require("../../assets/profile.png")}
                        />
                    </View>

                    <Text style={styles.welcomeText}>
                        {/* TODO: get name from user profile */}
                        Welcome, Jonathan Handfeld Miller-Smith III.
                    </Text>

                    {/* TODO: make birthday banner display reactive */}
                    <View style={styles.container.birthday}>
                        <Text>🎉 Happy birthday! 🎉</Text>
                    </View>
                </View>

                {/* TODO: factor time clock buttons out into a component */}
                <View style={styles.container.clockBtns}>
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
            </View>
        </View>
    );
}
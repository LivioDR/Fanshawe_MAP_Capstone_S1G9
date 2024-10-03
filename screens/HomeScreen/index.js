// React hooks
import { useReducer } from "react";

// RN components
import { Image, Text, View } from "react-native";

// custom components
import ClockStatusBanner from "../../components/timeClock/ClockStatusBanner";
import ClockButtons from "../../components/timeClock/ClockButtons";

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
            <ClockStatusBanner clockStatus={clockStatus} />

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

                <ClockButtons clockStatus={clockStatus} dispatch={dispatch} />
            </View>
        </View>
    );
}
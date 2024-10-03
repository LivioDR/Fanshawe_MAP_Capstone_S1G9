// React hooks
import { useEffect, useReducer } from "react";

// RN components
import { Image, Text, View } from "react-native";

// custom components
import ClockStatusBanner from "../../components/timeClock/ClockStatusBanner";
import ClockButtons from "../../components/timeClock/ClockButtons";

// database
import { getOpenTimeLog } from "../../services/database/timeClock";

// styles
import styles from "./styles";

export default function HomeScreen() {
    useEffect(() => {
        (async () => {
            // TODO: update hardcoded user id
            const timeLog = await getOpenTimeLog("user1234").catch((error) => console.log(error));
            dispatch({ type: "loadState", payload: timeLog });
        })();
    }, []);

    // manage state with a reducer to easily handle sub-values
    const initState = {
        timeLogId: "",
        userId: "",
        clockInTime: null,
        clockOutTime: null,
        onLunchTime: null,
        offLunchTime: null,
        clockedIn: false,
        onLunch: false,
        takenLunch: false,
    };
    const reducer = (state, action) => {
        switch (action.type) {
            case "loadState":
                const timeLog = action.payload;
                const newState = {...timeLog, ...initState};
                // timeLog stores id in "id" but we want it in "timeLogId", so move it
                newState.timeLogId = newState.id;
                delete newState.id;
                // only set up state if we have a clock in time and have not clocked out
                if (timeLog.clockInTime && !timeLog.clockOutTime) {
                    newState.clockedIn = true;

                    // set up lunch state
                    if (timeLog.offLunchTime) {
                        newState.takenLunch = true;
                    } else if (timeLog.onLunchTime && !timeLog.offLunchTime) {
                        newState.onLunch = true;
                        newState.takenLunch = true;
                    }
                }
                console.log(newState);
                return newState;

            case "clockIn":
                return {
                    ...state,
                    clockedIn: true,
                };
            
            case "clockOut":
                return {
                    ...state,
                    clockedIn: false,
                    onLunch: false,
                    takenLunch: false,
                };
            
            case "startLunch":
                return {
                    ...state,
                    onLunch: true,
                    takenLunch: true,
                };
            
            case "endLunch":
                return {
                    ...state,
                    onLunch: false,
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
// React hooks
import { useEffect, useReducer, useState } from "react";

// RN components
import { ActivityIndicator, Image, Text, View } from "react-native";

// custom components
import ClockStatusBanner from "../../components/timeClock/ClockStatusBanner";
import ClockButtons from "../../components/timeClock/ClockButtons";

// database
import { getOpenTimeLog } from "../../services/database/timeClock";

// styles
import styles from "./styles";

export default function HomeScreen() {
    const [clockedIn, setClockedIn] = useState(false);
    const [onLunch, setOnLunch] = useState(false);
    const [takenLunch, setTakenLunch] = useState(false);
    const [timeLog, setTimeLog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            // TODO: update hardcoded user id
            const curTimeLog = await getOpenTimeLog("user1234").catch((err) => console.error(err));

            if (curTimeLog) {
                setTimeLog(curTimeLog);

                // only set up state if we have a clock in time and have not clocked out
                if (curTimeLog.clockInTime && !curTimeLog.clockOutTime) {
                    setClockedIn(true);
    
                    // set up lunch state
                    if (curTimeLog.offLunchTime) {
                        setTakenLunch(true);
                    } else if (curTimeLog.onLunchTime && !curTimeLog.offLunchTime) {
                        setOnLunch(true);
                        setTakenLunch(true);
                    }
                }
            }

            setLoading(false);
        })();
    }, []);

    // clock status for passing to components
    const clockStatus = {
        clockedIn,
        onLunch,
        takenLunch,
        timeLog,
    };

    // action functions for the clock buttons
    const buttonActions = {
        clockIn: async () => {
            setClockedIn(true);
        },

        clockOut: async () => {
            setClockedIn(false);
            setOnLunch(false);
            setTakenLunch(false);
        },

        startLunch: async () => {
            setOnLunch(true);
            setTakenLunch(true);
        },

        endLunch: async () => {
            setOnLunch(false);
        },
    };

    const content = loading ?
        <>
            <ActivityIndicator size="large" />
            <Text style={styles.container.outer.loading.indicatorText}>Loading...</Text>
        </> :
        <>
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

                <ClockButtons clockStatus={clockStatus} actions={buttonActions} />
            </View>
        </>;

    return (
        <View style={[
            styles.container.outer,
            loading ? styles.container.outer.loading : undefined,
        ]}>
            {content}
        </View>
    );
}
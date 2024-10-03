// React hooks
import { useEffect, useState } from "react";

// RN components
import { ActivityIndicator, Image, Text, View } from "react-native";

// custom components
import ClockStatusBanner from "../../components/timeClock/ClockStatusBanner";
import ClockButtons from "../../components/timeClock/ClockButtons";

// database
import { Timestamp } from "firebase/firestore";
import { getOpenTimeLog, updateTimeLog } from "../../services/database/timeClock";

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

    /**
     * Update the specified time property in the database or revert the state if failed.
     * @param {string} timeProp time property to update
     * @returns true if successful, false if not
     */
    const updateTimeOrRevert = async (timeProp) => {
        // save current time log in case we need to revert
        const oldTimeLog = timeLog;

        // get current time as a Timestamp
        const curTime = Timestamp.now();

        // set new time log
        const newTimeLog = {...timeLog};
        newTimeLog[timeProp] = curTime;
        setTimeLog(newTimeLog);

        // make update in Firebase
        const success = await updateTimeLog(newTimeLog);

        // if we fail, revert state
        if (!success) {
            setTimeLog(oldTimeLog);
        }

        return success;
    };

    // action functions for the clock buttons
    const buttonActions = {
        clockIn: async () => {
            // assume we will succeed and update state
            setClockedIn(true);

            // TODO: create a new time log and write it to the database
        },

        clockOut: async () => {
            // assume we will succeed and update state
            setClockedIn(false);
            setOnLunch(false);
            setTakenLunch(false);

            // TODO: set end time and clear current time log
        },

        startLunch: async () => {
            // assume we will succeed and update state
            setOnLunch(true);
            setTakenLunch(true);

            // make update in Firebase
            const success = await updateTimeOrRevert("onLunchTime");

            // if we fail, revert state
            if (!success) {
                setOnLunch(false);
                setTakenLunch(false);
            }
        },

        endLunch: async () => {
            // assume we will succeed and update state
            setOnLunch(false);

            // make update in Firebase
            const success = await updateTimeOrRevert("offLunchTime");

            // if we fail, revert state
            if (!success) {
                setOnLunch(true);
            }
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
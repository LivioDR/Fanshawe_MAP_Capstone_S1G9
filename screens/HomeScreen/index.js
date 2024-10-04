// React hooks
import { useEffect, useState } from "react";

// RN components
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

// custom components
import ClockStatusBanner from "../../components/timeClock/ClockStatusBanner";
import ClockButtons from "../../components/timeClock/ClockButtons";

// database
import { Timestamp } from "firebase/firestore";
import { createTimeLog, getOpenTimeLog, updateTimeLog } from "../../services/database/timeClock";

// styles
import styles from "./styles";
import { accent } from "../../utilities/variables";

export default function HomeScreen() {
    const [clockedIn, setClockedIn] = useState(false);
    const [onLunch, setOnLunch] = useState(false);
    const [takenLunch, setTakenLunch] = useState(false);
    const [timeLog, setTimeLog] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // TODO: replace with flag loaded from profile
    const isSalaried = true;

    // async effect to load the user's current time log, if one exists
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
            // TODO: update hardcoded user id
            const newTimeLog = await createTimeLog("user1234", Timestamp.now());
            if (newTimeLog) {
                setTimeLog(newTimeLog);
                setClockedIn(true);
            } else {
                // TODO: handle errors more elegantly
                console.error("Something went wrong, try again later.");
            }
        },

        clockOut: async () => {
            // record if we're clocking out while on lunch
            const wasOnLunch = onLunch;
            const hadTakenLunch = takenLunch;

            // assume we will succeed and update state
            setClockedIn(false);
            setOnLunch(false);
            setTakenLunch(false);

            // save current time log in case we need to revert
            const oldTimeLog = timeLog;

            // get current time as a Timestamp
            const curTime = Timestamp.now();

            // create new time log and null existing one (since the user is clocking out)
            const newTimeLog = {...timeLog};
            newTimeLog.clockOutTime = curTime;
            if (wasOnLunch) {
                newTimeLog.offLunchTime = curTime;
            }
            setTimeLog(null);

            // make update in Firebase
            const success = await updateTimeLog(newTimeLog);

            // if we fail, revert state
            if (!success) {
                setTimeLog(oldTimeLog);
                setClockedIn(true);
                setOnLunch(wasOnLunch);
                setTakenLunch(hadTakenLunch);
            }
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

    // get the content to display based on loading status
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

                    {/* TODO: readd later, make birthday banner display reactive */}
                    {/* <View style={styles.container.birthday}>
                        <Text>🎉 Happy birthday! 🎉</Text>
                    </View> */}
                </View>

                <ClockButtons clockStatus={clockStatus} actions={buttonActions} />

                {isSalaried &&
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.workingHours.container}
                        onPress={() => console.log("configure working hours")}
                    >
                        <Text style={styles.workingHours.text}>Set regular in-office hours</Text>
                    </TouchableOpacity>
                }
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
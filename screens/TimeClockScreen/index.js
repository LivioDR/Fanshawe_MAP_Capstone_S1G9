// Expo native support
import * as SplashScreen from 'expo-splash-screen';

// localization
import { useTranslation } from "react-i18next";

// hooks
import { useEffect, useState } from "react";
import { useTheme } from "../../services/state/useTheme";

// RN components
import { Text, TouchableOpacity, View } from "react-native";

// custom components
import ClockStatusBanner from "../../components/timeClock/ClockStatusBanner";
import ClockButtons from "../../components/timeClock/ClockButtons";
import WorkingHoursModal from "../../components/timeClock/WorkingHoursModal";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import ProfileImage from "../../components/userBio/ProfileImage/ProfileImage";

// database, state, and auth
import { auth } from "../../config/firebase";
import { Timestamp } from "firebase/firestore";
import { getUserBioInfoById } from "../../services/database/userBioInfo";
import { getImageForUserId } from "../../services/database/profileImage";
import { createTimeLog, getOpenTimeLog, updateTimeLog } from "../../services/database/timeClock";

// styles
import styles from "./styles";
import { darkMode, darkBg, darkFont } from "../../services/themes/themes"


export default function TimeClockScreen() {
    const [clockedIn, setClockedIn] = useState(false);
    const [onLunch, setOnLunch] = useState(false);
    const [takenLunch, setTakenLunch] = useState(false);
    const [timeLog, setTimeLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showOfficeHourConfig, setShowOfficeHourConfig] = useState(false);
    const [isSalaried, setIsSalaried] = useState(false);
    const [userName, setUserName] = useState("Jonathan Handfeld Miller-Smith III");
    const [userProfileImage, setUserProfileImage] = useState("");

    const userId = auth.currentUser.uid;
    
    // color scheme
    const theme = useTheme()
    const isDarkMode = theme == darkMode

    // localization
    const { t } = useTranslation();
    
    // async effect to load the user's profile info and current time log, if one exists
    useEffect(() => {
        (async () => {
            const curTimeLog = await getOpenTimeLog(userId).catch((err) => console.error(err));

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

            // get or load user bio info
            const userInfo = await getUserBioInfoById(userId);
            if (userInfo) {
                setUserName(`${userInfo.firstName} ${userInfo.lastName}`);
                setIsSalaried(userInfo.salaried);
            }

            const userImageURL = await getImageForUserId(userId);
            if (userImageURL) {
                setUserProfileImage(userImageURL);
            }

            setLoading(false);
            SplashScreen.hideAsync();
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

        // make update in Firebase and global state
        const success = await updateTimeLog(newTimeLog);

        // if we fail, revert stateß
        if (!success) {
            setTimeLog(oldTimeLog);
        }

        return success;
    };

    // action functions for the clock buttons
    const buttonActions = {
        clockIn: async () => {
            const newTimeLog = await createTimeLog(userId, Timestamp.now());
            if (newTimeLog) {
                setTimeLog(newTimeLog);
                setClockedIn(true);
            } else {
                // TODO: handle errors more elegantly
                console.error(t("errors.generic"));
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

            // make update in Firebase and global state
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
        <LoadingIndicator /> :
        <>
            <ClockStatusBanner clockStatus={clockStatus} />

            <View style={[styles.container.inner, isDarkMode ? darkBg : {}]}>
                <View style={styles.container.intro}>
                    <View style={styles.container.image}>
                        <ProfileImage
                            url={userProfileImage}
                            imgSize={125}
                            // TODO: make this a bit more elegant
                            customStyles={{ borderWidth: 0, width: 125, height: 125 }}
                        />
                    </View>

                    <Text style={[styles.welcomeText, isDarkMode ? darkFont : {}]}>
                        {t("timeClock.welcome", { name: userName })}
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
                        onPress={() => setShowOfficeHourConfig(true)}
                    >
                        <Text style={styles.workingHours.text}>{t("timeClock.setOfficeHours")}</Text>
                    </TouchableOpacity>
                }

                <WorkingHoursModal
                    userId={userId}
                    shown={showOfficeHourConfig}
                    closeModal={() => setShowOfficeHourConfig(false)}
                />
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
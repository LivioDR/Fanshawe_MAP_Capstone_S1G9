import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";

import { Modal, View, Text, TouchableHighlight, Pressable } from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import TimePicker from "../../common/TimePicker";
import LoadingIndicator from "../../common/LoadingIndicator";

import { useBioInfo, getOrLoadUserBioInfo, updateUserBioInfo } from "../../../services/state/userBioInfo";

import styles from "./styles";

export default function WorkingHoursModal({ userId, shown, closeModal }) {
    const [startTime, setStartTime] = useState(new Date(2024, 9, 4, 9));
    const [endTime, setEndTime] = useState(new Date(2024, 9, 4, 17));
    const [loading, setLoading] = useState(true);
    const bioInfoContext = useBioInfo();

    const { t } = useTranslation();

    // async effect to load user working hours data
    useEffect(() => {
        (async () => {
            const userInfo = await getOrLoadUserBioInfo(userId, bioInfoContext);
            if (userInfo) {
                if ("workStartTime" in userInfo) {
                    const savedStartTime = userInfo.workStartTime.split(":");
                    const newStartTime = new Date();
                    newStartTime.setHours(savedStartTime[0], savedStartTime[1]);
                    setStartTime(newStartTime);
                }
                if ("workEndTime" in userInfo) {
                    const savedEndTime = userInfo.workEndTime.split(":");
                    const newEndTime = new Date();
                    newEndTime.setHours(savedEndTime[0], savedEndTime[1]);
                    setEndTime(newEndTime);
                }
            }
            setLoading(false);
        })();
    }, []);

    /**
     * Set a new start time in state and store to DB.
     * @param {Date} newStartTime new start time to set
     */
    const updateStartTime = async (newStartTime) => {
        // assume DB will be successful first and set state
        const oldStartTime = startTime;
        setStartTime(newStartTime);

        // make DB update
        const success = updateUserBioInfo(
            userId,
            { workStartTime: newStartTime.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }) },
            bioInfoContext
        );

        // revert state if necessary
        if (!success) {
            setStartTime(oldStartTime);
        }
    };

    /**
     * Set a new end time in state and store to DB.
     * @param {Date} newEndTime new end time to set
     */
    const updateEndTime = async (newEndTime) => {
        // assume DB will be successful first and set state
        const oldEndTime = endTime;
        setEndTime(newEndTime);

        // make DB update
        const success = updateUserBioInfo(
            userId,
            { workEndTime: newEndTime.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }) },
            bioInfoContext
        );

        // revert state if necessary
        if (!success) {
            setEndTime(oldEndTime);
        }
    };

    const content = loading ?
        <LoadingIndicator /> :
        <>
            <View>
                <Text style={styles.title}>{t("timeClock.workingHours.title")}</Text>
                <Text style={styles.subtitle}>{t("timeClock.workingHours.description")}</Text>
            </View>

            <View style={styles.picker.container}>
                {/* TODO: fix auto popup on Android */}
                <Text style={styles.picker.label}>{t("timeClock.workingHours.start")}</Text>
                <TimePicker initialValue={startTime} onChange={updateStartTime} />
            </View>
            <View style={styles.picker.container}>
                <Text style={styles.picker.label}>{t("timeClock.workingHours.end")}</Text>
                <TimePicker  initialValue={endTime} onChange={updateEndTime} />
            </View>

            <TouchableHighlight
                style={styles.close}
                onPress={closeModal}
                underlayColor="#A90000"
            >
                <FontAwesome name="close" size={14} color="white" />
            </TouchableHighlight>
        </>;

    return (
        <Modal
            visible={shown}
            animationType="fade"
            transparent={true}
        >
            <Pressable
                style={styles.overlay}
                // allow pressing overlay background to close modal
                onPress={closeModal}
            >
                <Pressable
                    style={styles.container}
                    // but prevent closing when pressing on the container or anything inside
                    onPress={() => {}}
                >
                    {content}
                </Pressable>
            </Pressable>
        </Modal>
    );
}
import { useEffect, useState } from "react";

import { Modal, View, Text, TouchableHighlight, Pressable } from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import TimePicker from "../../common/TimePicker";
import LoadingIndicator from "../../common/LoadingIndicator";

import { getUserBioInfoById, updateUserBioInfoById } from "../../../services/database/userBioInfo";

import styles from "./styles";

export default function WorkingHoursModal({ userId, shown, closeModal }) {
    // TODO: replace these with times loaded from DB
    const [startTime, setStartTime] = useState(new Date(2024, 9, 4, 9));
    const [endTime, setEndTime] = useState(new Date(2024, 9, 4, 17));
    const [loading, setLoading] = useState(true);

    // async effect to load user working hours data
    useEffect(() => {
        (async () => {
            const userInfo = await getUserBioInfoById(userId);
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
        const success = updateUserBioInfoById(
            userId,
            { workStartTime: newStartTime.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }) }
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
        setStartTime(newEndTime);

        // make DB update
        const success = updateUserBioInfoById(
            userId,
            { workStartTime: newEndTime.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }) }
        );

        // revert state if necessary
        if (!success) {
            setStartTime(oldEndTime);
        }
    };

    const content = loading ?
        <LoadingIndicator /> :
        <>
            <View>
                <Text style={styles.title}>Set Working Hours</Text>
                <Text style={styles.subtitle}>
                    Use the selectors to set the hours that you are typically
                    at work on an average day.
                </Text>
            </View>

            <View style={styles.picker.container}>
                {/* TODO: fix auto popup on Android */}
                <Text style={styles.picker.label}>Start Time</Text>
                <TimePicker initialValue={startTime} onChange={updateStartTime} />
            </View>
            <View style={styles.picker.container}>
                <Text style={styles.picker.label}>End Time</Text>
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
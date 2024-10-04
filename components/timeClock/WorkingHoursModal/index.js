import { useEffect, useState } from "react";

import { Modal, View, Text, TouchableHighlight, Pressable } from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import TimePicker from "../../common/TimePicker";

import styles from "./styles";
import LoadingIndicator from "../../common/LoadingIndicator";
import { getUserBioInfoById } from "../../../services/database/userBioInfo";

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
                <TimePicker initialValue={startTime} onChange={setStartTime} />
            </View>
            <View style={styles.picker.container}>
                <Text style={styles.picker.label}>End Time</Text>
                <TimePicker  initialValue={endTime} onChange={setEndTime} />
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
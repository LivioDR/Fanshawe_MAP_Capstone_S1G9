import { Modal, View, Text, TouchableOpacity } from "react-native";

import TimePicker from "../../common/TimePicker";

import styles from "./styles";

export default function WorkingHoursModal({ shown, closeModal }) {
    return (
        <Modal
            visible={shown}
            animationType="fade"
            transparent={true}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
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
                        <TimePicker />
                    </View>
                    <View style={styles.picker.container}>
                        <Text style={styles.picker.label}>End Time</Text>
                        <TimePicker />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
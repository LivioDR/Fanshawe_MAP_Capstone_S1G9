import { useState } from "react";

import { Platform, Text, TouchableOpacity } from "react-native";

import RNDateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import styles from "./styles";
import { useTheme } from "../../../services/state/useTheme";
import { darkMode } from "../../../services/themes/themes";

export default function TimePicker({ initialValue, onChange }) {
    const [time, setTime] = useState(initialValue);

    const theme = useTheme()
    const isDarkMode = theme === darkMode

    const onChangeTime = (pickerEvent) => {
        if (pickerEvent.type === "set") {
            const newTime = new Date(pickerEvent.nativeEvent.timestamp)
            setTime(newTime);
            onChange(newTime);
        }
    };

    // different rendering for Android and iOS
    // iOS renders the picker as an inline component, but Android launches a popup
    // so create a custom component for Android
    if (Platform.OS === "android") {
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.75}
                onPress={() => {
                    DateTimePickerAndroid.open({
                        mode: "time",
                        value: time,
                        onChange: onChangeTime,
                    })
                }}
            >
                <Text style={[styles.timeText, isDarkMode]}>
                    {time.toLocaleTimeString([], { hour12: true, hour: "numeric", minute: "2-digit" })}
                </Text>
            </TouchableOpacity>
        );
    } else {
        return (
            <RNDateTimePicker
                mode="time"
                display="compact"
                value={time}
                onChange={onChangeTime}
                themeVariant={isDarkMode ? "dark" : "light"}
            />
        );
    }
}
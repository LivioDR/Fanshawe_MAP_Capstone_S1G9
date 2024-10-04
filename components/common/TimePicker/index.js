import { Text, View } from "react-native";

import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function TimePicker() {
    return (
        <RNDateTimePicker mode="time" value={new Date()} />
    );
}
import React from "react";
import { View, Text } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import styles from "./FromToDatePickerStyles";

const FromToDatePicker = ({initialValue, setDate, label}) => {

    const dateChanged = (e,date) => {
        if(e.type == "set"){
            setDate(date)
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
            </Text>
            <RNDateTimePicker
                style={styles.picker}
                mode="date"
                minimumDate={new Date()}
                display="calendar"
                value={initialValue}
                onChange={dateChanged}
            />
        </View>
    )
}
export default FromToDatePicker
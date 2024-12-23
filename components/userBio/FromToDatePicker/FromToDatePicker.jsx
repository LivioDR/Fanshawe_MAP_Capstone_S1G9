import {useState} from "react";
import { View, Text, Pressable, Platform } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import styles from "./FromToDatePickerStyles";

// Theme imports
import { useTheme } from "../../../services/state/useTheme";
import { darkMode, darkFont, darkBg } from "../../../services/themes/themes";

const FromToDatePicker = ({initialValue, setDate, label}) => {

    const [show, setShow] = useState(false)

    const theme = useTheme()
    const isDarkMode = theme === darkMode

    const dateChanged = (e,date) => {
        if(e.type == "set"){
            setDate(date)
        }
        setShow(false)
    }

    return(
        <View style={[styles.container, isDarkMode ? darkBg : {}]}>
            <Text style={[styles.label, isDarkMode ? darkFont : {}]}>
                {label}
            </Text>
            {
                Platform.OS == "android" && !show &&
                    <Pressable
                    onPress={()=>{setShow(true)}}>
                        <Text style={[styles.androidDate, isDarkMode ? darkFont : {}]}>
                            {new Date(initialValue).toISOString().split("T")[0]}
                        </Text>
                    </Pressable>
            }
            {
                Platform.OS == "android" && show &&
                <RNDateTimePicker
                    style={styles.picker}
                    mode="date"
                    minimumDate={new Date()}
                    display="calendar"
                    value={initialValue}
                    onChange={dateChanged}
                />
            }
            {
                Platform.OS == "ios" &&
                <RNDateTimePicker
                    style={styles.picker}
                    themeVariant={isDarkMode ? "dark" : "light"}
                    mode="date"
                    minimumDate={new Date()}
                    display="calendar"
                    value={initialValue}
                    onChange={dateChanged}
                />
            }
        </View>
    )
}
export default FromToDatePicker
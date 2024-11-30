/*
Custom box to display messages to the user for user input.
*/

import styles from "./styles";
import { Text, View } from "react-native";

// Theme imports
import { useTheme } from "@react-navigation/native";
import { darkMode, darkBg, darkFont } from "../../services/themes/themes";

export default function InputMsgBox(props) {
  
  const theme = useTheme()
  const isDarkMode = theme === darkMode

  return (
      <View style={[styles.container, isDarkMode ? darkBg : {}]}>
        <Text style={[styles.buttonText, isDarkMode ? darkFont : {}]}>{props.text}</Text>
      </View>
  );
}
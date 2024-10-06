/*
Custom box to display messages to the user for user input.
*/

import styles from "./styles";
import { Text, View } from "react-native";

export default function InputMsgBox(props) {
  
  return (
      <View style={styles.container}>
        <Text style={styles.buttonText}>{props.text}</Text>
      </View>
  );
}
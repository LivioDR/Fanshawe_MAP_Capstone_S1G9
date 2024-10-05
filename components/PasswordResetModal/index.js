/*
Modal for resetting a user password
*/

import styles from "./styles";
import { Text, View } from "react-native";

export default function PasswordResetModal(props) {
  
  return (
      <View style={styles.container}>
        <Text style={styles.buttonText}>{props.text}</Text>
      </View>
  );
}
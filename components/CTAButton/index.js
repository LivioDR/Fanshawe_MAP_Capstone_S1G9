/*
Custom Call to Action (CTA) button component.
*/

import styles from "./styles";
import { Text, TouchableOpacity, View } from "react-native";

export default function CTAButton(props) {
  
  return (
    <TouchableOpacity style={[styles.container, props.disabled ? styles.disabledBtn : styles.enabledBtn]} onPress={props.onPress} disabled={props.disabled}>
      <View>

        <Text style={styles.buttonText}>{props.title}</Text>
        
      </View>
    </TouchableOpacity>
  );
}
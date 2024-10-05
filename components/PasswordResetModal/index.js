/*
Modal for resetting a user password
*/

import styles from "./styles";
import { Button, Modal, Text, TextInput, View } from "react-native";
import { auth, sendPasswordResetEmail } from "../../config/firebase";
import CTAButton from "../CTAButton";

export default function PasswordResetModal(props) {


  return (
  <Modal animationType="slide" visible={props.visible}>
    <View style={styles.modalView}>
        <Button title="Close"></Button>
        <TextInput
        style={styles.textInputContainer}
        placeholder="Email Address"
        //onChangeText={handleEmailChange}
        keyboardType={"number-pad"}
      />

        <CTAButton title="Send Password Reset Link"></CTAButton>

    </View>

  </Modal>
  );
}

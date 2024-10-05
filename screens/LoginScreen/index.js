import styles from "./styles";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import CTAButton from "../../components/CTAButton";
import InputMsgBox from "../../components/InputMsgBox";
import {
  auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "../../config/firebase";

export default function LoginScreen(props) {
  /* States */

  //User Input states
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [emailErrTxt, setEmailErrTxt] = useState("");
  const [pwdErrTxt, setPwdErrTxt] = useState("");
  const [loginBtnDisabled, setLoginBtnDisabled] = useState(true);

  /* Handlers */
  //If regex fine set errTxt to nothing
  const handleEmailChange = (value) => {
    setEmail(value);

    //Regex - pattern obtained via https://regexr.com/
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const emailRegexTest = emailRegex.test(value);

    if (emailRegexTest == false) {
      setEmailErrTxt("Please enter a valid email");
      setLoginBtnDisabled(true);
    } else {
      setEmailErrTxt("");
      //setLoginBtnDisabled(false);
    }
  };

  const handlePwdChange = (value) => {
    setPwd(value);

    //Sanity check for empty textbox
    if (value.length > 0) {
      setPwdErrTxt("");
      setLoginBtnDisabled(false);
    } else {
      setPwdErrTxt("Please enter a password");
      setLoginBtnDisabled(true);
    }
  };

  //Helper function for validating both fields and if so

  //Toast code
  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Success ✅",
      text2: "Login successful",
      position: "bottom",
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "Error 🛑",
      text2: "Incorrect username or password",
      visibilityTime: 2200,
      position: "bottom",
    });
  };

  const handleLoginPress = () => {
    //Make a db request for auth (async)
    signInWithEmailAndPassword(auth, email, pwd)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log("Signed in successfully");
        showToast();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
        showErrorToast();

        //Clearing password field if incorrect
        handlePwdChange("");
      });
  };

  const handleForgotPasswordPress = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };



  return (
    <View style={styles.container} setCredentials={props.setCredentials}>
      <TextInput
        style={styles.textInputContainer}
        placeholder="Email Address"
        onChangeText={handleEmailChange}
        keyboardType={"number-pad"}
      />

      <InputMsgBox text={emailErrTxt}></InputMsgBox>

      <TextInput
        style={styles.textInputContainer}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={handlePwdChange}
      />

      <InputMsgBox text={pwdErrTxt}></InputMsgBox>

      <CTAButton
        title="Login"
        onPress={handleLoginPress}
        disabled={loginBtnDisabled}
      ></CTAButton>

      <Button
        title="Forgotten Password?"
        onPress={handleForgotPasswordPress}
      ></Button>

      <View style={styles.footer}>
        <Text>Powered by IndusTree 🌳 © Copyright 2024</Text>
      </View>

      <StatusBar style="auto" />
      <Toast />
    </View>
  );
}
import styles from "./styles";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, Modal, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import CTAButton from "../../components/CTAButton";
import InputMsgBox from "../../components/InputMsgBox";
import {
  auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "../../config/firebase";
import PasswordResetModal from "../../components/PasswordResetModal";

export default function LoginScreen(props) {
  /* States */

  //User Input states
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [emailErrTxt, setEmailErrTxt] = useState("");
  const [pwdErrTxt, setPwdErrTxt] = useState("");
  const [loginBtnDisabled, setLoginBtnDisabled] = useState(true);

  //Other states
  const [showModal, setShowModal] = useState(false);

  /* Handlers */

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

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
  const showSuccessToast = (msg) => {
    Toast.show({
      type: "success",
      text1: "Success ✅",
      text2: msg,
      position: "bottom",
    });
  };

  const showErrorToast = (errMsg) => {
    Toast.show({
      type: "error",
      text1: "Error 🛑",
      text2: errMsg,
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
        showSuccessToast("Login successful");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
        showErrorToast("Incorrect username or password");

        //Clearing password field if incorrect
        handlePwdChange("");
      });
  };

  //Simply show modal, handle other logic in Modal class
  const handleForgotPasswordPress = () => {
    handleModalToggle();
  };

  const handleSendPasswordResetLink = () => {
    //First check if email exists in DBm, using clientside fetchSignInMethodsForEmail (as get userByEmail is only in the Admin SDK)
    //If no sign in method for provided email it does not exist in auth and can echo this to the user (using a toast)

    fetchSignInMethodsForEmail(auth, email)
      .then(() => {

        //Email is registered
        sendPasswordResetEmail(auth, email)
        .then(() => {

            showSuccessToast("Password reset email sent");
 
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          showErrorToast("Registered email but error sending reset email");
   
        });

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorMessage, errorCode);
        console.log("Non registered email");

        showErrorToast("This is not a registered email");
      });


  };

  return (
    <>
      

      <View style={styles.container} setCredentials={props.setCredentials}>
      <Toast />
        <TextInput
          style={styles.textInputContainer}
          placeholder="Email Address"
          onChangeText={handleEmailChange}
          keyboardType={"email"}
          autoCapitalize="none"
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

        <Modal animationType="slide" visible={showModal}>
          <View style={styles.modalView}>
            <Button title="Close" onPress={handleModalToggle}></Button>
            <TextInput
              style={styles.textInputContainer}
              placeholder="Email Address"
              onChangeText={handleEmailChange}
              value={email} //Prepopulates with current value in the state
              keyboardType={"email"}
              autoCapitalize="none"
            />

            <InputMsgBox text={emailErrTxt}></InputMsgBox>

            <CTAButton
              title="Send Password Reset Link"
              onPress={handleSendPasswordResetLink}
            ></CTAButton>
          </View>
          <Toast />
        </Modal>

        <StatusBar style="auto" />
      </View>
    </>
  );
}

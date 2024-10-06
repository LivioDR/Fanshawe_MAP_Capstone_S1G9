import styles from "./styles";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, Modal, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import CTAButton from "../../components/CTAButton";
import InputMsgBox from "../../components/InputMsgBox";
import {
  auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  signOut,
} from "../../config/firebase";

export default function LoginScreen(props) {
  /* Hooks */

  //useEffect to make sure user is signed out upon hitting the login page
  useEffect(() => {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("All users signed out");
      }).catch((error) => {
        // An error happened.
        console.log("Error signing users out");
      });
      
  }, []);

  /* States */
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [emailErrTxt, setEmailErrTxt] = useState("");
  const [pwdErrTxt, setPwdErrTxt] = useState("");
  const [loginBtnDisabled, setLoginBtnDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [passwordResetBtnDisabled, setPasswordResetBtnDisabled] =
    useState(true);

  /* Handlers */
  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  //If regex is true do not set an error message
  const handleEmailChange = (value) => {
    setEmail(value);

    //Regex - pattern obtained via https://regexr.com/
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const emailRegexTest = emailRegex.test(value);

    if (emailRegexTest == false) {
      setEmailErrTxt("Please enter a valid email");
      setLoginBtnDisabled(true);
      setPasswordResetBtnDisabled(true);
    } else {
      setEmailErrTxt("");
      setLoginBtnDisabled(false);
      setPasswordResetBtnDisabled(false);
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
    //Error, get email method now deprecated: https://github.com/firebase/firebase-android-sdk/issues/5586
    //First check if email exists in DB, using clientside fetchSignInMethodsForEmail (as get userByEmail is only in the Admin SDK)
    //If no sign in method for provided email it does not exist in auth and can echo this to the user (using a toast)

    console.log("Curr email:", auth);
    fetchSignInMethodsForEmail(auth, email)
      .then((signInMethodsArr) => {
        console.log("Curr email: ", email);
        console.log("Sign in methods arr: ", signInMethodsArr);

        if (signInMethodsArr.length > 0) {
          sendPasswordResetEmail(auth, email)
            .then(() => {
              showSuccessToast("Password reset email sent");
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;

              showErrorToast("Registered email but error sending reset email");
            });
        } else {
          showErrorToast("This is not a registered email");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorMessage, errorCode);
        console.log("Something went wrong");
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
              disabled={passwordResetBtnDisabled}
            ></CTAButton>
          </View>
          <Toast />
        </Modal>

        <StatusBar style="auto" />
      </View>
    </>
  );
}
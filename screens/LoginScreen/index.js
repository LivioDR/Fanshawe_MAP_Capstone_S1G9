import styles from "./styles";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, Modal, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { 
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import CTAButton from "../../components/CTAButton";
import InputMsgBox from "../../components/InputMsgBox";
import { auth } from "../../config/firebase";

export default function LoginScreen(props) {
  /* States */
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [emailErrTxt, setEmailErrTxt] = useState("");
  const [pwdErrTxt, setPwdErrTxt] = useState("");
  const [loginBtnDisabled, setLoginBtnDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [passwordResetBtnDisabled, setPasswordResetBtnDisabled] =
    useState(true);
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [pwdIsValid, setPwdIsValid] = useState(false);

  /* Hooks */

  /*
  Ensures that there are no active users signed in when the login page is entered
  */
  useEffect(() => {
    signOut(auth)
      .then(() => {
        showSuccessToast("Successfully signed out");
      })
      .catch(() => {
        showErrorToast("Error signing users out");
      });
  }, []);

  /*
  Tracks whenever the username or pwd changes and conducts the sanity check
  */
  useEffect(() => {
    updateLoginButtonState();
  }, [emailIsValid, pwdIsValid]);

  /* Handlers */

  const handleForgotPasswordPress = () => {
    handleModalToggle();
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  /*
  Sanity check for email
  Regex pattern obtained via https://regexr.com/
  */
  const handleEmailChange = (value) => {
    setEmail(value);

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const emailRegexTest = emailRegex.test(value);

    if (emailRegexTest == false) {
      setEmailIsValid(false);
      setEmailErrTxt("Please enter a valid email");
      setPasswordResetBtnDisabled(true);
    } else {
      setEmailIsValid(true);
      setEmailErrTxt("");
      setPasswordResetBtnDisabled(false);
    }
  };

  /* Sanity check for pwd */
  const handlePwdChange = (value) => {
    setPwd(value);

    if (value.length === 0) {
      setPwdIsValid(false);
      setPwdErrTxt("Please enter a password");
    } else {
      setPwdIsValid(true);
      setPwdErrTxt("");
    }
  };

  /*
  Attempts to sign user in to db
  */
  const handleLoginPress = () => {
    signInWithEmailAndPassword(auth, email, pwd)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        showSuccessToast("Login successful");
      })
      .catch(() => {
        showErrorToast("Incorrect username or password");
        handlePwdChange("");
      });
  };

  /*
  Sends a password reset email if the email is registered in the DB
  Due to security, theres no way in Firebase to sanity check whether an email is in the DB 
  before the request is made
  */
  const handleSendPasswordResetLink = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        showSuccessToast("Password reset via email requested");
      })
      .catch(() => {
        showErrorToast(
          "There was an error, sending the link, please try again"
        );
      });
  };

  /*
    Helper function for changing the login button state depending
    on whether the user input is valid
  */
  const updateLoginButtonState = () => {
    if (emailIsValid && pwdIsValid) {
      setLoginBtnDisabled(false);
    } else {
      setLoginBtnDisabled(true);
    }
  };

  /* Toast logic */
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
          onChangeText={handlePwdChange}
          secureTextEntry={true}
          value={pwd}
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
            <TextInput
              style={styles.textInputContainer}
              placeholder="Email Address"
              onChangeText={handleEmailChange}
              value={email} 
              keyboardType={"email"}
              autoCapitalize="none"
            />

            <InputMsgBox text={emailErrTxt}></InputMsgBox>

            <CTAButton
              title="Send Password Reset Link"
              onPress={handleSendPasswordResetLink}
              disabled={passwordResetBtnDisabled}
            ></CTAButton>

            <Button title="Close" onPress={handleModalToggle}></Button>
          </View>
          <Toast />
        </Modal>

        <StatusBar style="auto" />
      </View>
    </>
  );
}

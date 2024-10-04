import { StatusBar } from "expo-status-bar";
import { Button, Text, TextInput, View } from "react-native";
import styles from "./styles";
import CTAButton from "./components/CTAButton";
import InputMsgBox from "./components/InputMsgBox";
import { useState } from "react";
import { auth, signInWithEmailAndPassword } from "./config/firebase";
import Toast from "react-native-toast-message";


export default function App() {
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
    const emailRegexTest = emailRegex.test(email);

    if (emailRegexTest == false) {
      setEmailErrTxt("Please enter a valid email");
      setLoginBtnDisabled(true);
    } else {
      setEmailErrTxt("");
      setLoginBtnDisabled(false);
    }
  };

  const handlePwdChange = (value) => {
    setPwd(value);

    console.log("VAL: ", value.length);

  
    //Sanity check for empty textbox
    if(value.length > 0){
      setPwdErrTxt("");
      setLoginBtnDisabled(false);
    }else{
      setPwdErrTxt("Please enter a password");
      setLoginBtnDisabled(true);
    }

  };

  //Toast code
  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Success ✅",
      text2: "Login successful",
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "Error 🛑",
      text2: "Incorrect username or password",
    });
  };

  const handleLoginPress = () => {
    console.log("User ID: ", email);
    console.log("Password: ", pwd);


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
      });
  };

  return (
    <View style={styles.container}>
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
 
      <CTAButton title="Login" onPress={handleLoginPress} disabled={loginBtnDisabled}></CTAButton>

      <View style={styles.footer}>
        <Text>Powered by IndusTree 🌳 © Copyright 2024</Text>
      </View>

      <StatusBar style="auto" />
      <Toast />
    </View>
  );
}

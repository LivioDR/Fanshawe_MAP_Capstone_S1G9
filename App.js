import { StatusBar } from "expo-status-bar";
import { Button, Text, TextInput, View } from "react-native";
import styles from "./styles";
import CTAButton from "./components/CTAButton";
import { useState } from "react";

//From https://firebase.google.com/docs/auth/web/password-auth?_gl=1*pwxp5n*_up*MQ..*_ga*MTEzMDEwMjU5My4xNzI3Njg0NzMy*_ga_CW55HF8NVT*MTcyNzY4NDczMi4xLjAuMTcyNzY4NDczMi4wLjAuMA..#web
//import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { auth, signInWithEmailAndPassword } from "./config/firebase";

export default function App() {
  /* States */

  //User Input states
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  /* Handlers */
  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePwdChange = (value) => {
    setPwd(value);
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
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
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
      <TextInput
        style={styles.textInputContainer}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={handlePwdChange}
      />
      <CTAButton title="Login" onPress={handleLoginPress}></CTAButton>

      <View style={styles.footer}>
        <Text>Powered by IndusTree 🌳 © Copyright 2024</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

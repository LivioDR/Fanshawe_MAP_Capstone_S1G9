import styles from "./styles";
import { useEffect, useState } from "react";
import { Button, Modal, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { 
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { getUserBioInfoById } from "../../services/database/userBioInfo";
import InputMsgBox from "../../components/InputMsgBox";
import { auth } from "../../config/firebase";
import UiButton from "../../components/common/UiButton/UiButton";

export default function LoginScreen({ loginSuccess }) {
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
    (async () => {
        await signOut(auth).catch(() => showErrorToast("Error signing users out"));
        if (process.env.EXPO_PUBLIC_DEBUG_LOGIN) {
            const [debugEmail, debugPassword] = process.env.EXPO_PUBLIC_DEBUG_LOGIN.split("|");
            const debugCredential = await signInWithEmailAndPassword(auth, debugEmail, debugPassword);
            loginSuccess(debugCredential);
        }
    })();
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
      .then(async (userCredential) => {
        // Signed in correctly
        const user = userCredential.user;
        // But we check is the user is enabled before continuing
        const userInfo = await getUserBioInfoById(user.uid)
        if(userInfo.isEnabled){
          showSuccessToast("Login successful");
          loginSuccess(userCredential);
        }
        else{
          showErrorToast("User disabled. Please contact your administrator")

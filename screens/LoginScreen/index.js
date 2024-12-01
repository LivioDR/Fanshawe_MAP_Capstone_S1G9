import { useTranslation } from "react-i18next";
import styles from "./styles";
import { useEffect, useState } from "react";
import { Alert, Button, Modal, Text, TextInput, View } from "react-native";
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
import { useTrialCountdown } from "../../services/state/trialCountdown";

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
  const { t } = useTranslation();
  const {
    updateTrialCountdown,
    calculateTimeUntilExpiry,
  } = useTrialCountdown();

  /*
  Ensures that there are no active users signed in when the login page is entered
  */
  useEffect(() => {
    (async () => {
      await signOut(auth).catch(() =>
        showErrorToast(t("errors.login.signOut"))
      );
      if (process.env.EXPO_PUBLIC_DEBUG_LOGIN) {
        const [debugEmail, debugPassword] =
          process.env.EXPO_PUBLIC_DEBUG_LOGIN.split("|");
        const debugCredential = await signInWithEmailAndPassword(
          auth,
          debugEmail,
          debugPassword
        );
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
      setEmailErrTxt(t("errors.login.invalidEmail"));
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
      setPwdErrTxt(t("errors.login.noPassword"));
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
        const userInfo = await getUserBioInfoById(user.uid);

        if (userInfo.isEnabled) {
          // Checking whether an enabled user is in trial mode from the db info
          const trialUser = userInfo.isTrialUser;

          // If not, sign them out and exit method
          if (!trialUser) {
            await signOut(auth);
            return;
          }

          updateTrialCountdown({
            trialExpiryTimeString: userInfo.trialExpiryTime,
          });

          // Checking if the current trial mode user has a valid trial
          const isExpired = calculateTimeUntilExpiry(userInfo.trialExpiryTime);

          calculateTimeUntilExpiry(userInfo.trialExpiryTime);

          if (isExpired) {
            const expiredTrialDate = new Date(userInfo.trialExpiryTime);
            const expiredTrialString = expiredTrialDate.toLocaleString();

            Alert.alert(
              "Trial Expired",
              `Your trial expired on ${expiredTrialString} `,
              [{ text: "OK" }]
            );
            await signOut(auth);
            return;
          }

          loginSuccess(userCredential);
        } else {
          showErrorToast(t("errors.login.userDisabled"));
          await signOut(auth);
        }
      })
      .catch(() => {
        showErrorToast(t("errors.login.invalidCredentials"));
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
        showSuccessToast(t("login.passwordResetSuccess"));
      })
      .catch(() => {
        showErrorToast(t("errors.generic"));
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
      text1: t("login.success", { icon: "✅" }),
      text2: msg,
      position: "bottom",
    });
  };

  const showErrorToast = (errMsg) => {
    Toast.show({
      type: "error",
      text1: t("login.error", { icon: "🛑" }),
      text2: errMsg,
      visibilityTime: 2200,
      position: "bottom",
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Toast />
        <TextInput
          style={styles.textInputContainer}
          placeholder={t("login.email")}
          onChangeText={handleEmailChange}
          keyboardType={"email"}
          autoCapitalize="none"
        />

        <InputMsgBox text={emailErrTxt} />

        <TextInput
          style={styles.textInputContainer}
          placeholder={t("login.password")}
          onChangeText={handlePwdChange}
          secureTextEntry={true}
          value={pwd}
        />

        <InputMsgBox text={pwdErrTxt} />

        <UiButton
          label={t("login.login")}
          funcToCall={handleLoginPress}
          disabled={loginBtnDisabled}
          type="CTA"
        />

        <Button
          title={t("login.forgotPassword")}
          onPress={handleForgotPasswordPress}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("common.copy")}</Text>
        </View>

        <Modal animationType="slide" visible={showModal}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.textInputContainer}
              placeholder={t("login.email")}
              onChangeText={handleEmailChange}
              value={email}
              keyboardType={"email"}
              autoCapitalize="none"
            />

            <InputMsgBox text={emailErrTxt} />

            <UiButton
              label={t("login.sendPasswordReset")}
              funcToCall={handleSendPasswordResetLink}
              disabled={passwordResetBtnDisabled}
              type="CTA"
            />

            <Button title={t("common.close")} onPress={handleModalToggle} />
          </View>
          <Toast />
        </Modal>
      </View>
    </>
  );
}

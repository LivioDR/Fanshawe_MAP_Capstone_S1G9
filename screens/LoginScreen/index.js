import { useTranslation } from "react-i18next";
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
import { useTrialCountdown } from "../../services/state/trialCountdown";

// Theme imports
import { useTheme } from "../../services/state/useTheme";
import { darkMode, darkBg, darkFont } from "../../services/themes/themes";

export default function LoginScreen() {
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
    const theme = useTheme();
    const isDarkMode = theme === darkMode;
    const { updateTrialCountdown, calculateTimeUntilExpiry } =
        useTrialCountdown();

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
    Function to attempt to log a user in

    Several checks take place here:

    - Check the users credentials
    - Check the user is enabled
    - Check if an enabled user is in trial mode, if not sign in

    - If in trial mode, set state variables and calculate whether 
    their trial is currently valid
    - If their trial has expired, they do not proceed past the login screen
    - If their trial is valid, log the user in and trigger the stateful countdown
  */
    const handleLoginPress = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                pwd
            );
            const user = userCredential.user;
            const userInfo = await getUserBioInfoById(user.uid);

            if (userInfo.isEnabled) {
                const trialUser = userInfo.isTrialUser;

                if (!trialUser) {
                    loginSuccess(userCredential);
                    return;
                }

                // Updating the global state
                updateTrialCountdown({
                    trialExpiryTimeString: userInfo.trialExpiryTime,
                });

                //Triggers stateful countdown
                const isExpired = calculateTimeUntilExpiry(
                    userInfo.trialExpiryTime
                );

                if (isExpired) {
                    // Generating readable String for Toast
                    const expiredTrialDate = new Date(userInfo.trialExpiryTime);
                    const expiredTrialString =
                        expiredTrialDate.toLocaleString();

                    //Sign out user as soon as an expired trial is detected
                    await signOut(auth);

                    showErrorToast(
                        `Your trial expired on ${expiredTrialString}.`
                    );

                    return;
                }
            } else {
                showErrorToast(t("errors.login.userDisabled"));
                await signOut(auth);
            }
        } catch (error) {
            showErrorToast(t("errors.login.invalidCredentials"));
        }
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
            <View style={[styles.container, isDarkMode ? darkBg : {}]}>
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

                <View style={[styles.footer, isDarkMode ? darkBg : {}]}>
                    <Text
                        style={[styles.footerText, isDarkMode ? darkFont : {}]}
                    >
                        {t("common.copy")}
                    </Text>
                </View>

                <Modal
                    animationType="slide"
                    visible={showModal}
                    style={isDarkMode ? darkBg : {}}
                >
                    <View
                        style={{
                            flex: 1,
                            width: "100%",
                            backgroundColor: isDarkMode
                                ? darkBg.backgroundColor
                                : "",
                        }}
                    >
                        <View
                            style={[styles.modalView, isDarkMode ? darkBg : {}]}
                        >
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

                            <Button
                                title={t("common.close")}
                                onPress={handleModalToggle}
                            />
                        </View>
                        <Toast />
                    </View>
                </Modal>
            </View>
        </>
    );
}

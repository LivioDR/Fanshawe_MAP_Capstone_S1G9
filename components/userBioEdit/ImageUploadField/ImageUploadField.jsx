import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'
import ProfileImage from "../../userBio/ProfileImage/ProfileImage";
import styles from "./ImageUploadFieldStyle";
import { setImageForUserId } from "../../../services/database/profileImage";

const ImageUploadField = ({uid, imgUrl, setImgUrl}) => {

    const [loading, setLoading] = useState(false)

    // Tutorial from https://medium.com/@sanchit0496/how-to-upload-files-from-device-in-react-native-6206b8cd7aff
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (libraryStatus.status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                }
        
                const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
                if (cameraStatus.status !== 'granted') {
                alert('Sorry, we need camera permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: Platform.OS === 'ios' ? 0.2 : 1,
        });
    
        if (!result.canceled) {
            const fileUri = result.assets[0].uri
            console.log(fileUri)
            const newImgUrl = await setImageForUserId(uid, fileUri, setLoading)
            setImgUrl(newImgUrl);
        }
    };
    // End of tutorial code


    if(loading){
        return(
            <View style={styles.wrapper}>
                <Text>Loading...</Text>
            </View>
        )
    }
    else {
        return(
            <View style={styles.wrapper}>
                <ProfileImage url={imgUrl} />
                <Pressable
                    style={styles.pressStyle}
                    onPress={pickImage}
                >
                    <Text style={styles.label}>
                        Upload new picture
                    </Text>
                    <Ionicons name="cloud-upload-outline" size={24} />
                </Pressable>
            </View>
        )
    }
}
export default ImageUploadField
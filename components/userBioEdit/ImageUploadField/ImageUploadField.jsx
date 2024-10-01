import React from "react";
import { View, Text, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileImage from "../../userBio/ProfileImage/ProfileImage";
import styles from "./ImageUploadFieldStyle";

const ImageUploadField = ({imgUrl, setImageBlob}) => {

    return(
        <View style={styles.wrapper}>
            <ProfileImage url={imgUrl} />
            <Pressable
                style={styles.pressStyle}
                onPress={()=>{
                    console.log("Upload new picture pressed")
                    // setImageBlob()
                }}
            >
                <Text style={styles.label}>
                    Upload new picture
                </Text>
                <Ionicons name="cloud-upload-outline" size={24} />
            </Pressable>
        </View>
    )
}
export default ImageUploadField
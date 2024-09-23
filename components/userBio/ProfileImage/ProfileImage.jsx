import React from "react";
import { Image, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileImageStyles from "./ProfileImageStyles";


const ProfileImage = ({url}) => {

    if(url){
        return(
            <View style={ProfileImageStyles.container}>
                <Image
                src={url}
                />
            </View>
        )
    }
    else{
        return(
            <View style={ProfileImageStyles.container}>
                <Ionicons name="person" size={48} color="blue" />
            </View>
        )
    }


}
export default ProfileImage
import React from "react";
import { Image, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileImageStyles from "./ProfileImageStyles";


const ProfileImage = ({url, imgSize = 96, placeholderSize = 48, customStyles = {}}) => {

    if(url){
        return(
            <View style={{...ProfileImageStyles.container, width: imgSize+4, height: imgSize+4, ...customStyles}}>
                <Image
                source={{uri: url}}
                width={imgSize}
                height={imgSize}
                style={{
                    borderRadius: 50,
                }}
                />
            </View>
        )
    }
    else{
        return(
            <View style={ProfileImageStyles.container}>
                <Ionicons name="person" size={placeholderSize} color="blue" />
            </View>
        )
    }


}
export default ProfileImage
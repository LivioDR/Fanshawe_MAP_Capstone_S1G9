import React from "react";
import { Image, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileImageStyles from "./ProfileImageStyles";


const ProfileImage = ({url, imgSize = 96, placeholderSize = 48}) => {

    const frameSize = imgSize + 4

    if(url){
        return(
            <View style={{...ProfileImageStyles.container, width: frameSize, height: frameSize}}>
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
            <View style={{...ProfileImageStyles.container, width: frameSize, height: frameSize}}>
                <Ionicons name="person" size={placeholderSize} color="blue" />
            </View>
        )
    }


}
export default ProfileImage
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import bioStyles from "./UserBioStyles";
import ProfileImage from "../../components/userBio/ProfileImage/ProfileImage";
import NameRoleContainer from "../../components/userBio/NameRoleContainer/NameRoleContainer";
import InputWithLabel from "../../components/common/InputWithLabel/InputWithLabel";

const UserBio = () => {

    const [imgUrl, setImgUrl] = useState(undefined)
    const [userData, setUserData] = useState({})

    useEffect(()=>{
        // get user data
        // get image
    },[])


    return(
        <>
        <View style={bioStyles.header}>
            <ProfileImage url={imgUrl} />
            <NameRoleContainer name="John Doe" role="QA Tester" />
        </View>
        <View>
            <InputWithLabel label={"Test field"}/>
        </View>
        </>
    )
}
export default UserBio
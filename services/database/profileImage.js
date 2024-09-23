import { storage } from "../../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";

const getImageForUserId = async(id) => {
    let urlPath = undefined
    try{
        const pathRef = ref(storage, `users/${id}/profile.jpg`)
        await getDownloadURL(pathRef).then(imgUrl => urlPath = imgUrl)
        console.log(urlPath)
    }
    catch(e){
        console.error(e)
    }
    return urlPath
}

export { getImageForUserId }
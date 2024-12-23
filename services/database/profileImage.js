import i18next from "i18next";
import { storage } from "../../config/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const getImageForUserId = async(id) => {
    let urlPath = undefined
    try{
        const pathRef = ref(storage, `users/${id}/profile.jpg`)
        await getDownloadURL(pathRef).then(imgUrl => urlPath = imgUrl)
    }
    catch(e){
      // Removed console error displayed when no image is found. Fallback image still shown
      console.debug(e)
    }
    return urlPath
}

// Based on the Expo Firebase tutorial:
// https://docs.expo.dev/versions/latest/sdk/imagepicker/
const setImageForUserId = async(id, uri, setLoading) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662

    setLoading(true)

    try{
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError(i18next.t("errors.requestFailed")));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
      
        const fileRef = ref(storage, `users/${id}/profile.jpg`)
        const result = await uploadBytes(fileRef, blob);
      
        // We're done with the blob, close and release it
        blob.close();
    }
    catch(e){
        console.error(e)
    }
    setLoading(false)
  
    return await getImageForUserId(id);
  }
  // End of tutorial function

export { getImageForUserId, setImageForUserId }
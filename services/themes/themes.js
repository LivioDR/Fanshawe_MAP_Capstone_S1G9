import AsyncStorage from "@react-native-async-storage/async-storage"
import { Appearance } from "react-native"

// Theme setting key and default values
export const themeKey = "theme"
export const darkMode = "dark"
export const lightMode = "light"

export const setMode = async(mode) => {
    if(mode === darkMode || mode === lightMode){
        Appearance.setColorScheme(mode)
        await AsyncStorage.setItem(themeKey,mode)
    }
    return true
}
export const getMode = async() => {
    return await AsyncStorage.getItem(themeKey) || Appearance.getColorScheme()
}
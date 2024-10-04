import { View, Text } from "react-native";
import styles from "./LoadingScreenStyles";

const LoadingScreen = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>
                Loading...
            </Text>
        </View>
    )
}
export default LoadingScreen
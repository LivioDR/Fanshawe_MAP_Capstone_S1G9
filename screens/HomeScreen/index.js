// RN components
import { Image, Text, View } from "react-native";

// styles
import styles from "./styles";

export default function HomeScreen() {
    return (
        <View style={styles.container.outer}>
            {/* TODO: replace this with banner component */}
            <View style={styles.banner}>
                <Text style={styles.banner.text}>
                    You have been clocked in since 8:59 am.
                </Text>
            </View>

            <View style={styles.container.inner}>
                <View style={styles.container.intro}>
                    <View style={styles.container.image}>
                        <Image
                            style={styles.profileImage}
                            source={require("../../assets/profile.png")}
                        />
                    </View>

                    <Text style={styles.welcomeText}>
                        {/* TODO: get name from user profile */}
                        Welcome, Jonathan Handfeld Miller-Smith III.
                    </Text>

                    {/* TODO: make birthday banner display reactive */}
                    <View style={styles.container.birthday}>
                        <Text>🎉 Happy birthday! 🎉</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
// React hooks
import { useState } from "react";

// RN components
import { Image, Text, TouchableHighlight, View } from "react-native";

// styles
import styles from "./styles";

export default function HomeScreen() {
    const [clockedIn, setClockedIn] = useState(false);
    const [onLunch, setOnLunch] = useState(false);
    const [takenLunch, setTakenLunch] = useState(false);

    return (
        <View style={styles.container.outer}>
            {/* TODO: replace this with reactive banner component */}
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

                    {/* TODO: remove debug Texts */}
                    <Text>Clocked in? {clockedIn ? "Yes" : "No"}</Text>
                    <Text>On lunch? {onLunch ? "Yes" : "No"}</Text>
                </View>

                {/* TODO: factor time clock buttons out into a component */}
                <View style={styles.container.clockBtns}>
                    {/* TODO: replace with a custom shadowed button component */}
                    <TouchableHighlight
                        style={[styles.clockBtn, clockedIn ? undefined : styles.clockBtn.green]}
                        underlayColor="#DDD"
                        disabled={clockedIn}
                        onPress={() => { setClockedIn(true); }}
                    >
                        <Text style={styles.clockBtn.text}>Clock In</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.clockBtn, !clockedIn ? undefined : styles.clockBtn.red]}
                        underlayColor="#DDD"
                        disabled={!clockedIn}
                        onPress={() => {
                            setClockedIn(false);
                            setOnLunch(false);
                            setTakenLunch(false);
                        }}
                    >
                        <Text style={styles.clockBtn.text}>Clock Out</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.clockBtn, takenLunch || (!clockedIn || onLunch) ? undefined : styles.clockBtn.blue]}
                        underlayColor="#DDD"
                        disabled={takenLunch || (!clockedIn || onLunch)}
                        onPress={() => {
                            setOnLunch(true);
                            setTakenLunch(true);
                        }}
                    >
                        <Text style={styles.clockBtn.text}>Start Lunch</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.clockBtn, !(clockedIn && onLunch) ? undefined : styles.clockBtn.red]}
                        underlayColor="#DDD"
                        disabled={!(clockedIn && onLunch)}
                        onPress={() => { setOnLunch(false); }}
                    >
                        <Text style={styles.clockBtn.text}>End Lunch</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    );
}
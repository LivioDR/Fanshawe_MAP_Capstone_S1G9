import { useTranslation } from "react-i18next";

import { View } from "react-native";

import UiButton from "../../common/UiButton/UiButton";

import styles from "./styles";

export default function ClockButtons({ clockStatus, actions = {} }) {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <UiButton
                label={t("timeClock.buttons.clockIn")}
                disabled={clockStatus.clockedIn}
                funcToCall={"clockIn" in actions ? actions.clockIn : undefined}
                type="confirm"
                customStyles={styles.clockBtn}
            />
            <UiButton
                label={t("timeClock.buttons.clockOut")}
                disabled={!clockStatus.clockedIn}
                funcToCall={"clockOut" in actions ? actions.clockOut : undefined}
                type="warning"
                customStyles={styles.clockBtn}
            />
            <UiButton
                label={t("timeClock.buttons.startLunch")}
                disabled={clockStatus.takenLunch || (!clockStatus.clockedIn || clockStatus.onLunch)}
                funcToCall={"startLunch" in actions ? actions.startLunch : undefined}
                type="primary"
                customStyles={styles.clockBtn}
            />
            <UiButton
                label={t("timeClock.buttons.endLunch")}
                disabled={!(clockStatus.clockedIn && clockStatus.onLunch)}
                funcToCall={"endLunch" in actions ? actions.endLunch : undefined}
                type="warning"
                customStyles={styles.clockBtn}
            />
        </View>
    );
}
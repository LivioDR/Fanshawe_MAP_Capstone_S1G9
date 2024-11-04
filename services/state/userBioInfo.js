import { createContext, useContext, useState } from "react";

import { getUserBioInfoById } from "../database/userBioInfo";

const defaultState = {
    bios: {},
};

const UserBioInfoContext = createContext(defaultState);

export function UserBioInfoProvider({ children }) {
    const [state, setState] = useState(defaultState);

    const updateBio = (newState) => {
        setState({ ...state, ...newState });
    };

    return (
        <UserBioInfoContext.Provider value={{ ...state, updateBio }}>
            {children}
        </UserBioInfoContext.Provider>
    );
}

export function useBioInfo() {
    return useContext(UserBioInfoContext);
}

/**
 * Retrieve from state or load bio info for the specified user.
 * @param {function} bioState current bio state from useBioInfo
 */
export async function getOrLoadUserBioInfo(userId, bioState) {
    if (bioState.bios[userId]) {
        return bioState.bios[userId];
    }

    const bio = await getUserBioInfoById(userId);

    if (bio) {
        bioState.updateBio({ bios: { ...bioState.bios, [userId]: bio } });
    }

    return bio;
}
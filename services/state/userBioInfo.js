import { createContext, useContext, useState } from "react";

import { getUserBioInfoById, setUserBioInfoById, updateUserBioInfoById } from "../database/userBioInfo";

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
 * @param {object} bioState current bio state from useBioInfo
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

/**
 * Set the specified user's bio info with state support.
 * @param {string} userId user ID to set
 * @param {object} data bio data to set
 * @param {object} bioState current bio info state object
 */
export async function setUserBioInfo(userId, data, bioState) {
    // assume set will be successful and update state first
    // save current state in case we need to revert state
    const lastBio = bioState.bios[userId];
    bioState.updateBio({ bios: { ...bioState.bios, [userId]: data } });

    // do database update
    const success = await setUserBioInfoById(userId, data);

    // revert state on failure
    if (!success) {
        bioState.updateBio({ bios: { ...bioState.bios, [userId]: lastBio } });
    }

    return success;
}

/**
 * Update the specified user's bio info with state support.
 * @param {string} userId user ID to update
 * @param {object} data bio data to update
 * @param {object} bioState current bio info state object
 */
export async function updateUserBioInfo(userId, data, bioState) {
    // assume update will be successful and update state first
    // save current state in case we need to revert state
    const lastBio = bioState.bios[userId];
    const newState = { bios: { ...bioState.bios, [userId]: { ...lastBio, ...data } } }
    bioState.updateBio(newState);

    // do database update
    const success = await updateUserBioInfoById(userId, data);

    // revert state on failure
    if (!success) {
        bioState.updateBio({ bios: { ...bioState.bios, [userId]: lastBio } });
    }

    return success;
}
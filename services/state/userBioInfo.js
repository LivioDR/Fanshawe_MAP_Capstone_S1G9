import { createContext, useContext, useState } from "react";

import { getTeamInfoById, getUserBioInfoById, setUserBioInfoById, updateUserBioInfoById } from "../database/userBioInfo";
import { getImageForUserId, setImageForUserId } from "../database/profileImage";

const defaultState = {
    bios: {},
    teams: {},
    images: {},
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
 * @returns user bio info, or undefined if not found
 */
export async function getOrLoadUserBioInfo(userId, bioState) {
    if (bioState.bios[userId]) {
        console.log("getting user from state");
        return bioState.bios[userId];
    }

    const bio = await getUserBioInfoById(userId);
    console.log("getting user from db");

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
 * @returns true if successful, false if failed
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
 * @returns true if successful, false if failed
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

/**
 * Retrieve from state or load team info for the specified team.
 * @param {object} bioState current bio state from useBioInfo
 * @returns team info, or undefined if not found
 */
export async function getOrLoadTeamInfo(teamId, bioState) {
    if (bioState.teams[teamId]) {
        console.log("getting team from state");
        return bioState.teams[teamId];
    }

    const team = await getTeamInfoById(teamId);
    console.log("getting team from db");

    if (team) {
        bioState.updateBio({ teams: { ...bioState.teams, [teamId]: team } });
    }

    return team;
}

/**
 * Retrieve from state or load the list of employee IDs for the specified team.
 * @param {object} bioState current bio state from useBioInfo
 * @returns list of employees for the given team, or undefined if not found
 */
export async function getTeamMemberIds(teamId, bioState) {
    const teamInfo = await getOrLoadTeamInfo(teamId, bioState);
    return teamInfo.employees;
}

/**
 * Retrieve from state or load the profile image URL for the specified user.
 * @param {object} bioState current bio state from useBioInfo
 * @returns image URL, or undefined if not found
 */
export async function getOrLoadProfileImage(userId, bioState) {
    if (bioState.images[userId]) {
        console.log("getting image from state");
        return bioState.images[userId];
    }

    const urlPath = await getImageForUserId(userId);
    console.log("getting image from db");

    if (urlPath) {
        bioState.updateBio({ images: { ...bioState.images, [userId]: urlPath } });
    }

    return urlPath;
}

/**
 * Set the user's profile image, also updating state.
 * @param {string} userId user ID to update
 * @param {string} uri image URI
 * @param {function} setLoading loading state function
 * @param {object} bioState current bio state from useBioInfo
 * @returns the URL path of the uploaded image, or undefined if failed
 */
export async function setProfileImage(userId, uri, setLoading, bioState) {
    const urlPath = await setImageForUserId(userId, uri, setLoading);

    if (urlPath) {
        bioState.updateBio({ images: { ...bioState.images, [userId]: urlPath } });
    }

    return urlPath
}
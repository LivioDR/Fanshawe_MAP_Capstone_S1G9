import { createContext, useContext, useEffect, useState } from "react";

/*
Context for making a stateful countdown for users that are in trial mode for the date
and time that the trial ends

The trialExpiryTime is fetched from the user in the db

Due to the implementation of the handleLoginPress() method, only trial customers will call the methods
of this context
*/

/*
trialExpiryTime - ISO String for expiry from the db
timeUntilExpiry - Computed variable from this context (Date object) for remaining time

isTrialUser - gets this from the db, this is updated 
*/
const defaultState = {
  trialExpiryTimeString: null,
  timeUntilExpiry: null,
  trialIsExpired: null,
  isTrialUser: null,
};

const TrialCountdownContext = createContext(defaultState);

export function TrialCountdownProvider({ children }) {
  const [state, setState] = useState(defaultState);

  const setTrialUserStatus = (status) => {
    setState((prevState) => ({
      ...prevState,
      isTrialUser: status,
    }));
  };

  const updateTrialCountdown = (newState) => {
    setState((prevState) => {
      const updatedState = { ...prevState, ...newState };
      console.log("Updated state: ", updatedState);
      return updatedState;
    });
  };

  /*
    If time left hits 0, the state for trialIsExpired updates to true
    This method is called every 0.5s so there is constant checking of their status

    Setting isTrialUser to true here as this method is only called when a user is a trial user
    */
  const calculateTimeUntilExpiry = (trialExp) => {
    //const trialExpiryTimeDate = new Date(state.trialExpiryTimeString);
    const trialExpiryTimeDate = new Date(trialExp);
    const currTime = new Date();
    const timeLeftInSeconds = Math.max(
      Math.floor((trialExpiryTimeDate - currTime) / 1000),
      0
    );

    const isExpired = timeLeftInSeconds === 0;

    updateTrialCountdown({
      trialExpiryTimeString: trialExp,
      timeUntilExpiry: timeLeftInSeconds,
      trialIsExpired: isExpired,
      isTrialUser: true,
    });

    return isExpired;
  };

  /*
    Updates are made every second to account for delays in processing, i.e.
    if called every second, no time is given for the method to actually execute and update
    the state to a representative time.

    Using Window functions setInterval() and clearInterval()
    https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
    https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval

    clearInterval() used to avoid memeory leaks 
    */
  useEffect(() => {
    if (!state.trialExpiryTimeString) return;
    if (state.trialIsExpired) return;

    const interval = setInterval(() => {
      calculateTimeUntilExpiry(state.trialExpiryTimeString);
    }, 500);

    return () => clearInterval(interval);
  }, [state.trialExpiryTimeString, state.timeUntilExpiry]);

  return (
    <TrialCountdownContext.Provider
      value={{
        ...state,
        updateTrialCountdown,
        setTrialUserStatus,
        calculateTimeUntilExpiry,
      }}
    >
      {children}
    </TrialCountdownContext.Provider>
  );
}

export function useTrialCountdown() {
  return useContext(TrialCountdownContext);
}

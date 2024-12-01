import { useTrialCountdown } from "./trialCountdown";
import { useImperativeHandle, forwardRef } from "react";

/*
Component that acts as a wrapper for the context methods
This is required as some TrialCountdownContext methods are 
called in App.js. However, as App.js iself is wrapped in the ContextProvider,
it cannot call the methods from itself in a useEffect.

Therefore the provider needs to wraop this component which simply uses
the useRef hook to refer to the context methods.

useImperativeHandle specifies the methods that are exposed to the parent, without
this the parent can essentially only access the reference itself and not the actual methods.
*/

const TrialMethods = forwardRef((props, ref) => {
    const { resetTrialState, updateTrialCountdown, calculateTimeUntilExpiry } =
        useTrialCountdown();

    /*
    Methods exposed to the parent
    */
    useImperativeHandle(ref, () => ({
        resetTrialState: () => {
            resetTrialState();
        },
        updateTrialCountdown: (trialExpiryTimeString) => {
            updateTrialCountdown({ trialExpiryTimeString });
        },
        calculateTimeUntilExpiry: (trialExpiryTimeString) => {
            return calculateTimeUntilExpiry(trialExpiryTimeString);
        },
    }));

    return null;
});

export default TrialMethods;

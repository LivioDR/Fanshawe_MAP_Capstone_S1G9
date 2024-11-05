import { createContext, useContext, useState } from "react";

const defaultState = {
    logs: {},
};

const TimeLogContext = createContext(defaultState);

export function TimeLogProvider({ children }) {
    const [state, setState] = useState(defaultState);

    const updateTimeLog = (newState) => {
        setState({ ...state, ...newState });
    };

    return (
        <TimeLogContext.Provider value={{ ...state, updateTimeLog }}>
            {children}
        </TimeLogContext.Provider>
    );
}

export function useTimeLog() {
    return useContext(TimeLogContext);
}
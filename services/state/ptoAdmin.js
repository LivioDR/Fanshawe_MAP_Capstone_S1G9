import { createContext, useContext, useState } from "react";

/*
The purpose of this function is to provide a context with states which relate
to editing a users PTO by an admin.

This includes:

- inAdminMode: Determines whether the user is an admin, this is used here
as a global context as it will determine the onPress behaviour of the UserCards
Default state set to false for security reasons: Principle of least priviledge (PoLP)

- showEditPtoModal: Determines if the PTO modal should be shown. This is added 
globally due to the Modal being triggered by a UserCard press (as this value is edited)

- currentIdForPtoEdit: Gets the current users id from the pressed card

*/

const defaultState = {
    inAdminMode: false,
    showEditPtoModal: false,
    currentIdForPtoEdit: null,
};

const PTOAdminContext = createContext(defaultState);

export function PTOAdminProvider({ children }) {
    const [state, setState] = useState(defaultState);

    const updatePTOAdmin = (newState) => {
        setState({ ...state, ...newState });
    };

    return (
        <PTOAdminContext.Provider value={{ ...state, updatePTOAdmin }}>
            {children}
        </PTOAdminContext.Provider>
    );
}

export function usePTOAdmin() {
    return useContext(PTOAdminContext);
}


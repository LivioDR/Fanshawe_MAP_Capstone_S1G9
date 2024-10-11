import { createContext, useContext } from "react";

const UserCredentialContext = createContext(null);

export function CredentialProvider({ children, userCreds }) {
    return (
        <UserCredentialContext.Provider value={userCreds}>
            {children}
        </UserCredentialContext.Provider>
    );
}

export function useCredentials() {
    return useContext(UserCredentialContext);
}
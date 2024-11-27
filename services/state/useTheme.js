import { createContext, useContext } from "react";

const ThemeContext = createContext(null)

export function ThemeProvider({ children, userTheme }) {
    return (
        <ThemeContext.Provider value={userTheme}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
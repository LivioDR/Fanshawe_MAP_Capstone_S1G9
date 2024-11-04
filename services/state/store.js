import { configureStore } from "@reduxjs/toolkit";

import userCredentialsReducer from "./userCredentialsSlice";

export default store = configureStore({
    reducer: {
        credentials: userCredentialsReducer,
    },
});
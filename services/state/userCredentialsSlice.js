import { createSlice } from "@reduxjs/toolkit";

const userCredentialsSlice = createSlice({
    name: "credentials",
    initialState: null,
    reducers: {
        setCredentials: (_state, action) => {
            return action.payload;
        },
    },
});

export const { setCredentials } = userCredentialsSlice.actions;

export default userCredentialsSlice.reducer;
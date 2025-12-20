import { createSlice } from "@reduxjs/toolkit";

const safeParse = (value) => {
    try {
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || null,
        role: localStorage.getItem("role") || null,
        user: safeParse(localStorage.getItem("user")) || null,
        isAuthenticated: !!localStorage.getItem("token"),  // <-- ADD THIS
    },


    reducers: {
        setCredentials: (state, action) => {
            const { token, role, user } = action.payload;

            state.token = token;
            state.role = role;
            state.user = user;
            state.isAuthenticated = true;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("user", JSON.stringify(user));
        },


        logout: (state) => {
            state.token = null;
            state.role = null;
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
        },

    },
});


export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

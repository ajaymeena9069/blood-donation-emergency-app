import { createSlice } from "@reduxjs/toolkit";
import { bloodApi } from "../api/bloodApi"; // RTK Query API import karo

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
        user: safeParse(localStorage.getItem("user")) || null,
        isAuthenticated: !!localStorage.getItem("token"),
    },

    reducers: {
        setCredentials: (state, action) => {
            const { token, user } = action.payload;

            state.token = token;
            state.user = user;
            state.isAuthenticated = true;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        },

        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
        },

        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        }
    },
});

export const { setCredentials, updateUser } = authSlice.actions;
export const logoutUser = () => (dispatch) => {
    dispatch(bloodApi.util.resetApiState());
    dispatch(authSlice.actions.logout());
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
};

export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { bloodApi } from "../api/bloodApi"; // RTK Query API import karo

const safeParse = (value) => {
    try {
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
};

const validateToken = (token) => {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

const storedToken = localStorage.getItem("token");
const isValidToken = validateToken(storedToken);

if (!isValidToken && storedToken) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: isValidToken ? storedToken : null,
        user: isValidToken ? safeParse(localStorage.getItem("user")) : null,
        isAuthenticated: isValidToken,
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
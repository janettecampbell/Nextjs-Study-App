import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setUser } from "./userSlice";
import { AppDispatch } from "../store";

// Define the types for the user and authentication state
interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state of the auth slice
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Asynchronous thunk action for logging in
export const login = createAsyncThunk<
  { user: User; token: string }, // Return both user and token
  { email: string; password: string },
  { dispatch: AppDispatch; rejectValue: string }
>("auth/login", async ({ email, password }, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    const { user, token } = response.data;
    console.log("Login API response user:", user);

    // Set user in Redux state
    dispatch(setUser({
      _id: user._id,
      name: user.name,
      email: user.email
    }));

    return { user, token }; // Return both user and token
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// Asynchronous thunk action for logging out
export const logoutAction = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    // Optionally, make an API call to handle server-side logout
    await axios.post("/api/auth/logout");

    // Dispatch the logout action to clear the state
    dispatch(authSlice.actions.logout());
  }
);

// Async action to load user data
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      console.log("User data loaded:", response.data.user);
      return response.data.user; // Return the user data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load user"
      );
    }
  }
);

// Slice to handle authentication state
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      console.log("authSlice", state.user);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        console.log("Load user fulfilled with:", action.payload);
        state.user = action.payload; // Set the user state
        state.isAuthenticated = true; // Mark as authenticated
      })
      .addCase(loadUser.rejected, (state, action) => {
        console.error("Load user rejected:", action.payload);
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Exporting actions and reducer from the slice
export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;

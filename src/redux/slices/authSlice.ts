import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

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
  token: Cookies.get("token") || null, // Retrieve token from cookies
  isAuthenticated: !!Cookies.get("token"), // Check if token exists
  loading: false,
  error: null,
};

// Asynchronous thunk action for logging in
export const login = createAsyncThunk<
  { user: User; token: string }, // Return both user and token
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    const { user, token } = response.data;

    // Store the token in cookies
    Cookies.set("token", token, {
      expires: 1, // Cookie will expire in 1 day
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      path: "/",
    });

    return { user, token }; // Return both user and token
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const logoutAction = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    // Clear token from cookies and dispatch the logout action
    Cookies.remove("token");
    dispatch(authSlice.actions.logout());
  }
);

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("token");
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      Cookies.remove("token"); // Clear token on logout
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
        state.user = action.payload; // Set the user state
        state.isAuthenticated = true; // Mark as authenticated
      })
      // Handle errors if needed
      .addCase(loadUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Exporting actions and reducer from the slice
export const { setUser, logout } = authSlice.actions; // Export both actions
export default authSlice.reducer;

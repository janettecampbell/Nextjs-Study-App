import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
    _id: string | null;
    name: string | null;
    email: string | null;
  } | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{_id: string, name: string; email: string }>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;

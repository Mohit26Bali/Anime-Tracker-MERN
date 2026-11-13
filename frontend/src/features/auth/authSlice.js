import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import { apiErrorMessage } from "../../utils/apiError";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/register", {
        username,
        email,
        password,
      });
      return data;
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, "Registration failed"));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", { email, password });
      return data;
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, "Login failed"));
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/auth/me");
      return data;
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, "Not authenticated"));
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await axiosInstance.post("/auth/logout");
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ username, avatar }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch("/auth/me", { username, avatar });
      return data;
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, "Update failed"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "succeeded";
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;

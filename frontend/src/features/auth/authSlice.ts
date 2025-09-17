import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "@/app/api/agent";
import { RootState } from "@/app/store/store";
import { LoginUserData, AuthState } from "./types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
};

// ✅ LOGIN
export const loginUser = createAsyncThunk<
  LoginUserData,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, thunkAPI) => {
  try {
    const res = await agent.Auth.login(credentials.email, credentials.password);
    // backend vraća { accessToken, user }
    localStorage.setItem("token", res.accessToken);
    return res.user;
  } catch (err: any) {
    console.error(err);
    return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
  }
});

// ✅ REGISTER
export const registerUser = createAsyncThunk<
  LoginUserData,
  { name: string; lastName: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (body, thunkAPI) => {
  try {
    const res = await agent.Auth.register(body);
    localStorage.setItem("token", res.accessToken);
    return res.user as LoginUserData;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || "Register failed");
  }
});

// ✅ FETCH CURRENT USER (koristi se kod refresh ili reload)
export const fetchCurrentUser = createAsyncThunk<
  LoginUserData,
  void,
  { rejectValue: string }
>("auth/me", async (_, thunkAPI) => {
  try {
    const res = await agent.Users.getUserById("me"); // ili napravi poseban agent.Users.getMe()
    return res as LoginUserData;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || "Failed to fetch user"
    );
  }
});

// ✅ REFRESH (opcionalno ako hoćeš ručno da pozoveš)
export const refreshToken = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("auth/refresh", async (_, thunkAPI) => {
  try {
    const res = await agent.Auth.refresh(); // vraća { accessToken }
    localStorage.setItem("token", res.accessToken);
    return res.accessToken;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to refresh");
  }
});

// logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await agent.Auth.logout();
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      localStorage.removeItem("token");
      thunkAPI.dispatch(logout()); // ručno očisti state
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    setUser: (state, action: PayloadAction<LoginUserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "idle";
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = "failed";
      })
      // REGISTER
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      // REFRESH
      .addCase(refreshToken.fulfilled, (state) => {
        // ovdje ne treba user, samo token update
        state.isAuthenticated = !!state.user;
      });
    //   //LOGOUT
    //   .addCase(logoutUser.fulfilled, (state) => {
    //     state.isAuthenticated = false;
    //     state.user = null;
    //   });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;

// Selector helperi
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import agent from "@/app/api/agent";
import { RootState } from "@/app/store/store";
import { BasicUserData, AuthState } from "./types";
import { RegisterUserDto } from "./types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
};

// ✅ LOGIN
export const loginUser = createAsyncThunk<
  BasicUserData,
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
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "Login failed"
    );
  }
});

// ✅ REGISTER
export const registerUser = createAsyncThunk<
  BasicUserData,
  RegisterUserDto,
  { rejectValue: string }
>("auth/register", async (body, thunkAPI) => {
  try {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });

    const res = await agent.Auth.register(formData);

    localStorage.setItem("token", res.accessToken);
    return res.user as BasicUserData;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "Register failed"
    );
  }
});

// ✅ FETCH CURRENT USER (koristi se kod refresh ili reload)
export const fetchCurrentUser = createAsyncThunk<
  BasicUserData,
  void,
  { rejectValue: string }
>("auth/me", async (_, thunkAPI) => {
  try {
    const res = await agent.Users.getMe();
    return res.user as BasicUserData;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "Failed to fetch user"
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
    return thunkAPI.rejectWithValue(
      err.response?.data.message || "Failed to refresh"
    );
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

export const verificationSender = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("auth/sendVerification", async ({ email }, thunkAPI) => {
  try {
    const res = await agent.Auth.verifyAccount(email);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data.message);
  }
});

export const verifyUser = createAsyncThunk<
  BasicUserData,
  { token: string },
  { rejectValue: string }
>("auth/verifyUser", async ({ token }, thunkAPI) => {
  try {
    const res = await agent.Auth.onVerifyAccount(token);
    return res.user as BasicUserData;
  } catch (error: any) {
    return (
      thunkAPI.rejectWithValue(error.response?.data.message) ||
      "Verifikacije nije uspjela iz nepoznatog razloga."
    );
  }
});

export const forgotPasswordSender = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("auth/forgotPasswordSender", async ({ email }, thunkAPI) => {
  try {
    await agent.Auth.forgotPassword(email);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data.message ||
        "Nažalost nismo uspjeli poslati mejl za ponovno kreiranje vaše lozinke."
    );
  }
});

//reset PASSWORD
export const resetPassword = createAsyncThunk<
  { message: string },
  { password: string; confirmPassword: string; resetToken: string },
  { rejectValue: string }
>("auth/resetPassword", async (body, thunkAPI) => {
  try {
    const res = await agent.Auth.resetPassword(body);
    return res;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data.message ||
        "Neuspjesan proces resetovanje lozinke, probajte ponovo kasnije."
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      localStorage.removeItem("token");
    },
    setUser: (state, action: PayloadAction<BasicUserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action: PayloadAction<BasicUserData>) => {
      state.user = { ...state.user, ...action.payload };
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
        state.status = "succeeded";
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
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "succeeded";
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "failed";
      })
      // REFRESH
      .addCase(refreshToken.fulfilled, (state) => {
        // ovdje ne treba user, samo token update
        state.isAuthenticated = !!state.user;
      })
      // VERIFY
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true; // da se osigura
      });
  },
});

export const { logout, setUser, updateUser } = authSlice.actions;
export default authSlice.reducer;

// Selector helperi
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

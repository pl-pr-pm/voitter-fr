import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
// import { PROPS_AUTHEN, PROPS_NICKNAME, PROPS_PROFILE } from "../types";

type PROPS_SIGNINUP_AUTHEN = {
  username: string;
  password: string;
};

type PROPS_PROFILE_AUTHEN = {
  username: string;
  imageUrl: string;
};

type PROPS_UPDATE_PROFILE_AUTHEN = {
  username: string;
  image: File | null;
  isImageChange: boolean;
};

type PROPS_LOGOUT_AUTHEN = {
  username: string;
};

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncSignup = createAsyncThunk(
  "auth/signup", //action name
  async (authen: PROPS_SIGNINUP_AUTHEN) => {
    const res = await axios.post(`${apiUrl}auth/signup`, authen, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsyncLogin = createAsyncThunk(
  "auth/login", //action name
  async (authen: PROPS_SIGNINUP_AUTHEN) => {
    const res = await axios.post(`${apiUrl}auth/signin`, authen, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsyncLogout = createAsyncThunk(
  "auth/logout", //action name
  async () => {
    const res = await axios.post(`${apiUrl}auth/signout`, null, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return;
  }
);

export const fetchAsyncGetProf = createAsyncThunk(
  "prof/get", //action name
  async () => {
    const res = await axios.get(`${apiUrl}auth/user`, {
      withCredentials: true,
    });
    return res.data[0];
  }
);

export const fetchAsyncUpdateProf = createAsyncThunk(
  "prof/update", //action name
  async (authen: any) => {
    // 強行突破
    const res = await axios.post(`${apiUrl}auth/user`, authen, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  // それぞれのモーダル用にフラグを持っている。
  initialState: {
    openSignIn: false, //for login modal
    openSignUp: false, //for register modal
    openProfile: false, //for profile modal
    openLogout: false,
    isLoadingAuth: false,
    loginUsername: "",
    profile: {
      username: "",
      password: "",
      imageUrl: "",
    },
  },

  reducers: {
    // Auth時に表示するローディングを管理する
    // API実行時にtrue/falseを切り替える
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    setOpenSignIn(state) {
      state.openSignIn = true;
    },
    resetOpenSignIn(state) {
      state.openSignIn = false;
    },
    setOpenSignUp(state) {
      state.openSignUp = true;
    },
    resetOpenSignUp(state) {
      state.openSignUp = false;
    },
    setOpenLogout(state) {
      state.openLogout = true;
    },
    resetOpenLogout(state) {
      state.openLogout = false;
    },
    setOpenProfile(state) {
      state.openProfile = true;
    },

    resetOpenProfile(state) {
      state.openProfile = false;
    },
    editLoginUsername(state, action) {
      state.loginUsername = action.payload;
    },
    editUsername(state, action) {
      state.profile.username = action.payload;
    },
    editPassword(state, action) {
      state.profile.password = action.payload;
    },
    editImageUrl(state, action) {
      state.profile.imageUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      return {
        ...state,
        loginUsername: action.payload,
      };
    });
    builder.addCase(fetchAsyncLogout.fulfilled, (state, action) => {
      state.loginUsername = "";
      state.profile = {
        username: "",
        password: "",
        imageUrl: "",
      };
    });

    builder.addCase(fetchAsyncGetProf.fulfilled, (state, action) => {
      state.profile = action.payload;
    });

    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
  },
});

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  setOpenLogout,
  resetOpenLogout,
  editUsername,
  editPassword,
  editImageUrl,
} = authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenLogout = (state: RootState) => state.auth.openLogout;
export const selectLoginuser = (state: RootState) => state.auth.loginUsername;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectProfile = (state: RootState) => state.auth.profile;

export default authSlice.reducer;

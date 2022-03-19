import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

type PROPS_SIGNINUP_AUTHEN = {
  username: string;
  password: string;
};

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const authJudgeError = (method: string, errorMessage: string, arg: any) => {
  let errorText = "";
  if (errorMessage.includes("401")) {
    errorText = `${method}に失敗しました。ユーザーとパスワードを確認してください。`;
  } else if (errorMessage.includes("530")) {
    errorText = `既に登録されているユーザーです。`;
  }
  window.alert(errorText);
};

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
    try {
      const res = await axios.post(`${apiUrl}auth/signout`, null, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e: any) {
      // AccessTokenが期限切れた場合、refresh API を実行する
      if (e.message.indexOf("401") !== -1) {
        console.log("error", e.message);
        await axios.get(`${apiUrl}auth/refresh`, {
          withCredentials: true,
        });
        await axios.post(`${apiUrl}auth/signout`, null, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
  }
);

export const fetchAsyncGetProf = createAsyncThunk(
  "prof/get", //action name
  async () => {
    try {
      const res = await axios.get(`${apiUrl}auth/user`, {
        withCredentials: true,
      });
      return res.data[0];
    } catch (e: any) {
      // AccessTokenが期限切れた場合、refresh API を実行する
      if (e.message.indexOf("401") !== -1) {
        console.log("error", e.message);
        await axios.get(`${apiUrl}auth/refresh`, {
          withCredentials: true,
        });
        const res = await axios.get(`${apiUrl}auth/user`, {
          withCredentials: true,
        });
        return res.data[0];
      }
    }
  }
);

export const fetchAsyncUpdateProf = createAsyncThunk(
  "prof/update", //action name
  // 型強行突破
  async (authen: any) => {
    try {
      const res = await axios.post(`${apiUrl}auth/user`, authen, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (e: any) {
      // AccessTokenが期限切れた場合、refresh API を実行する
      if (e.message.indexOf("401") !== -1) {
        console.log("error", e.message);
        await axios.get(`${apiUrl}auth/refresh`, {
          withCredentials: true,
        });
        const res = await axios.post(`${apiUrl}auth/user`, authen, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data;
      }
    }
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
    builder.addCase(fetchAsyncSignup.rejected, (state, action) => {
      console.log(action.error);
      if (action.error.stack) {
        authJudgeError("SignUp", action.error.stack!, action.meta.arg);
      } else {
        const errorText = `Errorが発生しました: ${action.error.message}`;
        window.alert(errorText);
      }
    });

    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      state.loginUsername = action.payload;
    });

    builder.addCase(fetchAsyncLogin.rejected, (state, action) => {
      console.log(action.error);
      if (action.error.stack) {
        authJudgeError("Login", action.error.stack!, action.meta.arg);
      } else {
        const errorText = `Errorが発生しました: ${action.error.message}`;
        window.alert(errorText);
      }
    });

    builder.addCase(fetchAsyncLogout.fulfilled, (state, action) => {
      state.loginUsername = "";
      state.profile = {
        username: "",
        password: "",
        imageUrl: "",
      };
    });

    builder.addCase(fetchAsyncLogout.rejected, (state, action) => {
      const errorText = `Errorが発生しました: ${action.error.message}`;
      window.alert(errorText);
    });

    builder.addCase(fetchAsyncGetProf.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
    builder.addCase(fetchAsyncGetProf.rejected, (state, action) => {
      const errorText = `Errorが発生しました: ${action.error.message}`;
      window.alert(errorText);
    });

    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.rejected, (state, action) => {
      const errorText = `Errorが発生しました: ${action.error.message}`;
      window.alert(errorText);
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

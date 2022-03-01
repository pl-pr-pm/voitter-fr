import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
// import { PROPS_AUTHEN, PROPS_NICKNAME, PROPS_PROFILE } from "../types";

const apiUrl = process.env.REACT_APP_DEV_API_URL;

// export const fetchAsyncLogin = createAsyncThunk(
//   "auth/post", //action name
//   async (authen: PROPS_AUTHEN) => {
//     const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return res.data;
//   }
// );

// // 新規アカウント作成
// export const fetchAsyncLegister = createAsyncThunk(
//   "auth/register",
//   async (authen: PROPS_AUTHEN) => {
//     const res = await axios.post(`${apiUrl}api/register/`, authen, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return res.data;
//   }
// );

// // 新規プロフィール作成
// export const fetchAsyncCreateProf = createAsyncThunk(
//   "profile/post",
//   async (nickName: PROPS_NICKNAME) => {
//     const res = await axios.post(`${apiUrl}api/profile/`, nickName, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `JWT ${localStorage.localJWT}`,
//       },
//     });
//     return res.data;
//   }
// );

// export const fetchAsyncUpdateProf = createAsyncThunk(
//   "profile/put",
//   async (profile: PROPS_PROFILE) => {
//     const uploadData = new FormData();
//     uploadData.append("nickName", profile.nickName);
//     profile.img && uploadData.append("img", profile.img, profile.img.name);
//     const res = await axios.put(
//       `${apiUrl}api/profile/${profile.id}/`,
//       uploadData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `JWT ${localStorage.localJWT}`,
//         },
//       }
//     );
//     return res.data;
//   }
// );

// export const fetchAsyncGetProf = createAsyncThunk("profile/get", async () => {
//   const res = await axios.get(`${apiUrl}api/myprofile/`, {
//     headers: {
//       Authorization: `JWT ${localStorage.localJWT}`,
//     },
//   });
//   return res.data[0]; // 配列で返却されるため、０番目の要素を取得
// });

// export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
//   const res = await axios.get(`${apiUrl}api/profile/`, {
//     headers: {
//       Authorization: `JWT ${localStorage.localJWT}`,
//     },
//   });
//   return res.data;
// });

export const authSlice = createSlice({
  name: "auth",
  // それぞれのモーダル用にフラグを持っている。
  initialState: {
    // openSignIn: true, //for login modal
    // openSignUp: false, //for register modal
    openProfile: false, //for profile modal
    isLoadingAuth: false,
    myprofile: {
      id: 0,
      nickName: "",
      userProfile: 0,
      created_on: "",
      img: "",
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
    // setOpenSignIn(state) {
    //   state.openSignIn = true;
    // },
    // resetOpenSignIn(state) {
    //   state.openSignIn = false;
    // },
    // setOpenSignUp(state) {
    //   state.openSignUp = true;
    // },
    // resetOpenSignUp(state) {
    //   state.openSignUp = false;
    // },
    setOpenProfile(state) {
      state.openProfile = true;
    },

    resetOpenProfile(state) {
      state.openProfile = false;
    },
    editNickname(state, action) {
      state.myprofile.nickName = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
  //     localStorage.setItem("localJWT", action.payload.access);
  //   });
  //   builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
  //     console.log(
  //       `fetchAsyncCreateProf.fulfilled action payload is ${action.payload}`
  //     );
  //     state.myprofile = action.payload;
  //   });
  //   builder.addCase(fetchAsyncGetProf.fulfilled, (state, action) => {
  //     state.myprofile = action.payload;
  //   });
  //   builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
  //     state.profiles = action.payload;
  //   });
  //   builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
  //     state.myprofile = action.payload;
  //     state.profiles = state.profiles.map((profile) =>
  //       profile.id === action.payload.id ? action.payload : profile
  //     );
  //   });
  // },
});

export const {
  fetchCredStart,
  fetchCredEnd,
  // setOpenSignIn,
  // resetOpenSignIn,
  // setOpenSignUp,
  // resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  editNickname,
} = authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;

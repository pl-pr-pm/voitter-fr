import React from "react";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWPOST, PROPS_LIKED, PROPS_COMMENT } from "../types";

const apiUrl = process.env.REACT_APP_DEV_API_URL;
const apiUrlTimeline = `${process.env.REACT_APP_DEV_API_URL}timeline/`;
const apiUrlUserinfo = `${process.env.REACT_APP_DEV_API_URL}user-info/`;

export const fetchAsyncGetTimeline = createAsyncThunk(
  "timeline/get",
  async (username: string) => {
    const res = await axios.get(`${apiUrlTimeline}?username=${username}`, {
      withCredentials: true,
    });
    return res.data;
  }
);

export const fetchAsyncGetTimelineTranslate = createAsyncThunk(
  "timelineTranslate/get",
  async (username: string) => {
    try {
      const res = await axios.get(
        `${apiUrlTimeline}translate?username=${username}`,
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (e: any) {
      // AccessTokenが期限切れた場合、refresh API を実行する
      if (e.message.indexOf("401") !== -1) {
        console.log("error", e.message);
        await axios.get(`${apiUrl}auth/refresh`, {
          withCredentials: true,
        });
        const res = await axios.get(
          `${apiUrlTimeline}translate?username=${username}`,
          {
            withCredentials: true,
          }
        );
        return res.data;
      }
    }
  }
);

export const fetchAsyncGetUserInfo = createAsyncThunk(
  "userinfo/get",
  async (username: string) => {
    const res = await axios.get(`${apiUrlUserinfo}?username=${username}`, {
      withCredentials: true,
    });
    return res.data;
  }
);

export const timelineSlice = createSlice({
  name: "timeline",
  initialState: {
    targetUsername: "",
    isLoadingTimeline: false,
    openNewTimeline: false,
    timelineUserinfo: {
      username: "",
      description: "",
      profile_image_url: "",
    },
    timelines: [
      {
        _id: "",
        tweetContent: {
          tweetText: "",
          createdAt: "",
          voiceUrl: "",
        },
        username: "",
      },
    ],
    currentTrackIndex: 0,
    isTranslate: false,
  },

  reducers: {
    setTimelineStart(state) {
      state.isLoadingTimeline = true;
    },
    setTimelineEnd(state) {
      state.isLoadingTimeline = false;
    },
    editTargetUsername(state, action) {
      state.targetUsername = action.payload;
    },
    setCurrentTrackIndex(state, action) {
      state.currentTrackIndex = action.payload;
    },
    setIsTranslate(state, action) {
      state.isTranslate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetTimeline.fulfilled, (state, action) => {
      state.timelines = action.payload;
    });
    builder.addCase(fetchAsyncGetTimeline.rejected, (state, action) => {
      const errorText = `Errorが発生しました: ${action.error.message}`;
      window.alert(errorText);
    });
    builder.addCase(
      fetchAsyncGetTimelineTranslate.fulfilled,
      (state, action) => {
        state.timelines = action.payload;
      }
    );
    builder.addCase(fetchAsyncGetUserInfo.fulfilled, (state, action) => {
      state.timelineUserinfo = action.payload;
    });
    builder.addCase(fetchAsyncGetUserInfo.rejected, (state, action) => {
      const errorText = `Errorが発生しました: ${action.error.message}`;
      window.alert(errorText);
    });
  },
});
export const {
  setTimelineStart,
  setTimelineEnd,
  editTargetUsername,
  setCurrentTrackIndex,
  setIsTranslate,
} = timelineSlice.actions;

export const selectIsLoadingTimeline = (state: RootState) =>
  state.timeline.isLoadingTimeline;
export const selectTargetUsername = (state: RootState) =>
  state.timeline.targetUsername;
// export const selectOpenNewTimeline = (state: RootState) => state.post.openNewPost;
export const selectTimeline = (state: RootState) => state.timeline.timelines;
export const selectUserInfo = (state: RootState) =>
  state.timeline.timelineUserinfo;
export const selectCurrentTrackIndex = (state: RootState) =>
  state.timeline.currentTrackIndex;
export const selectIsTranslate = (state: RootState) =>
  state.timeline.isTranslate;
export default timelineSlice.reducer;

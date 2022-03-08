import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWPOST, PROPS_LIKED, PROPS_COMMENT } from "../types";

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
    const res = await axios.get(`${apiUrlTimeline}/translate`, {
      withCredentials: true,
    });
    return res.data;
  }
);

export const fetchAsyncGetUserInfo = createAsyncThunk(
  "userinfo/get",
  async (username: string) => {
    const res = await axios.get(apiUrlUserinfo, {
      withCredentials: true,
    });
    return res.data;
  }
);

export const timelineSlice = createSlice({
  name: "timeline",
  initialState: {
    isLoadingTimeline: false,
    openNewTimeline: false,
    timelineUserinfo: {
      timelineUsername: "",
      description: "",
      profile_image_url: "",
    },
    tweetContent: [
      {
        tweetText: "",
        createdAt: "",
        voiceUrl: "",
      },
    ],
  },

  reducers: {
    fetchTimelineStart(state) {
      state.isLoadingTimeline = true;
    },
    fetchTimelineEnd(state) {
      state.isLoadingTimeline = false;
    },
    // setOpenNewPost(state) {
    //   state.openNewPost = true;
    // },
    // resetOpenNewPost(state) {
    //   state.openNewPost = false;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetTimeline.fulfilled, (state, action) => {
      state.tweetContent = action.payload.tweetContent;
    });
    builder.addCase(
      fetchAsyncGetTimelineTranslate.fulfilled,
      (state, action) => {
        state.tweetContent = action.payload.tweetContent;
      }
    );
    builder.addCase(fetchAsyncGetUserInfo.fulfilled, (state, action) => {
      state.timelineUserinfo = {
        timelineUsername: action.payload.username,
        description: action.payload.description,
        profile_image_url: action.payload.profile_image_url,
      };
    });
  },
});
export const { fetchTimelineStart, fetchTimelineEnd } = timelineSlice.actions;

export const selectIsLoadingTimeline = (state: RootState) =>
  state.timeline.isLoadingTimeline;
// export const selectOpenNewTimeline = (state: RootState) => state.post.openNewPost;
export const selectTimeline = (state: RootState) => state.timeline.tweetContent;
export const selectUserInfo = (state: RootState) =>
  state.timeline.timelineUserinfo;

export default timelineSlice.reducer;

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
      timelineUsername: "",
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
    // setOpenNewPost(state) {
    //   state.openNewPost = true;
    // },
    // resetOpenNewPost(state) {
    //   state.openNewPost = false;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetTimeline.fulfilled, (state, action) => {
      console.log(action.payload);
      state.timelines = action.payload;
    });
    builder.addCase(
      fetchAsyncGetTimelineTranslate.fulfilled,
      (state, action) => {
        state.timelines = action.payload;
      }
    );
    builder.addCase(fetchAsyncGetUserInfo.fulfilled, (state, action) => {
      console.log(action.payload);
      state.timelineUserinfo = action.payload;
    });
  },
});
export const { setTimelineStart, setTimelineEnd, editTargetUsername } =
  timelineSlice.actions;

export const selectIsLoadingTimeline = (state: RootState) =>
  state.timeline.isLoadingTimeline;
export const selectTargetUsername = (state: RootState) =>
  state.timeline.targetUsername;
// export const selectOpenNewTimeline = (state: RootState) => state.post.openNewPost;
export const selectTimeline = (state: RootState) => state.timeline.timelines;
export const selectUserInfo = (state: RootState) =>
  state.timeline.timelineUserinfo;

export default timelineSlice.reducer;

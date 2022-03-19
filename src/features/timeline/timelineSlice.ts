import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

const apiUrl = process.env.REACT_APP_DEV_API_URL;
const apiUrlTimeline = `${process.env.REACT_APP_DEV_API_URL}timeline/`;
const apiUrlUserinfo = `${process.env.REACT_APP_DEV_API_URL}user-info/`;

type PROPS_TIMELINE = {
  username: string;
  untilId: string;
};

const userInfoJudgeError = (errorMessage: string, arg: any) => {
  let errorText = "";
  if (errorMessage.includes("513") || errorMessage.includes("516")) {
    errorText = `対象のユーザーが見つかりませんでした: ${arg}`;
  } else {
    errorText = `Errorが発生しました: ${errorMessage}`;
  }
  window.alert(errorText);
};

const timelineJudgeError = (errorMessage: string, arg: any) => {
  if (!(errorMessage.includes("513") || errorMessage.includes("516"))) {
    window.alert(`Errorが発生しました: ${errorMessage}`);
  }
};

export const fetchAsyncGetTimeline = createAsyncThunk(
  "timeline/get",
  async (propsTimeline: PROPS_TIMELINE) => {
    const { username, untilId } = propsTimeline;
    const res = await axios.get(
      `${apiUrlTimeline}?username=${username}&untilId=${untilId}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetTimelineTranslate = createAsyncThunk(
  "timelineTranslate/get",
  async (propsTimeline: PROPS_TIMELINE) => {
    const { username, untilId } = propsTimeline;
    try {
      const res = await axios.get(
        `${apiUrlTimeline}translate?username=${username}&untilId=${untilId}`,
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
          `${apiUrlTimeline}translate?username=${username}&untilId=${untilId}`,
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
    untilId: "0000000000",
  },

  reducers: {
    refreshTimelines(state) {
      state.timelines = [
        {
          _id: "",
          tweetContent: {
            tweetText: "",
            createdAt: "",
            voiceUrl: "",
          },
          username: "",
        },
      ];
    },
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
    setUntilId(state, action) {
      state.untilId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetTimeline.fulfilled, (state, action) => {
      const addTimeline = action.payload;
      // 初回リクエストの場合、timelinesを新規作成
      // 初回以降は、timelinesを追加する
      if (state.untilId === "0000000000") {
        state.timelines = addTimeline;
      } else {
        const newTimelines = state.timelines.concat(addTimeline);
        state.timelines = newTimelines;
      }
      // 最後の要素のtweetIdが最古のtweetIdとなっている
      state.untilId = addTimeline[addTimeline.length - 1].tweetId;
    });
    builder.addCase(fetchAsyncGetTimeline.rejected, (state, action) => {
      console.log(action.error?.stack);
      // 現在表示されているタイムラインを初期化する
      state.timelines = [
        {
          _id: "",
          tweetContent: {
            tweetText: "",
            createdAt: "",
            voiceUrl: "",
          },
          username: "",
        },
      ];

      if (action.error.message) {
        timelineJudgeError(action.error.message!, action.meta.arg);
      } else {
        const errorText = `Errorが発生しました: ${action.error.message}`;
        window.alert(errorText);
      }
    });
    builder.addCase(
      fetchAsyncGetTimelineTranslate.fulfilled,
      (state, action) => {
        const addTimeline = action.payload;
        // 初回リクエストの場合、timelinesを新規作成
        // 初回以降は、timelinesを追加する
        if (state.untilId === "0000000000") {
          state.timelines = addTimeline;
        } else {
          const newTimelines = state.timelines.concat(addTimeline);
          state.timelines = newTimelines;
        }
        // 最後の要素のtweetIdが最古のtweetIdとなっている
        state.untilId = addTimeline[addTimeline.length - 1].tweetId;
      }
    );
    builder.addCase(
      fetchAsyncGetTimelineTranslate.rejected,
      (state, action) => {
        // 現在表示されているタイムラインを初期化する
        state.timelines = [
          {
            _id: "",
            tweetContent: {
              tweetText: "",
              createdAt: "",
              voiceUrl: "",
            },
            username: "",
          },
        ];
        console.log(action.error?.stack);
        if (action.error.message) {
          timelineJudgeError(action.error.message!, action.meta.arg);
        } else {
          const errorText = `Errorが発生しました: ${action.error.message}`;
          window.alert(errorText);
        }
      }
    );
    builder.addCase(fetchAsyncGetUserInfo.fulfilled, (state, action) => {
      state.timelineUserinfo = action.payload;
    });
    builder.addCase(fetchAsyncGetUserInfo.rejected, (state, action) => {
      state.timelineUserinfo = {
        username: "",
        description: "",
        profile_image_url: "",
      };

      if (action.error.message) {
        userInfoJudgeError(action.error.message!, action.meta.arg);
      } else {
        const errorText = `Errorが発生しました: ${action.error.message}`;
        window.alert(errorText);
      }
    });
  },
});
export const {
  refreshTimelines,
  setTimelineStart,
  setTimelineEnd,
  editTargetUsername,
  setCurrentTrackIndex,
  setIsTranslate,
  setUntilId,
} = timelineSlice.actions;

export const selectIsLoadingTimeline = (state: RootState) =>
  state.timeline.isLoadingTimeline;
export const selectTargetUsername = (state: RootState) =>
  state.timeline.targetUsername;
export const selectTimeline = (state: RootState) => state.timeline.timelines;
export const selectUserInfo = (state: RootState) =>
  state.timeline.timelineUserinfo;
export const selectCurrentTrackIndex = (state: RootState) =>
  state.timeline.currentTrackIndex;
export const selectIsTranslate = (state: RootState) =>
  state.timeline.isTranslate;
export const selectUntilId = (state: RootState) => state.timeline.untilId;
export default timelineSlice.reducer;

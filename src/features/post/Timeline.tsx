import React, { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
// import styles from "./Post.module.css";

import { makeStyles } from "@material-ui/core/styles";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import {
  selectTimeline,
  selectCurrentTrackIndex,
  setCurrentTrackIndex,
} from "./timelineSlice";
import { Tweet } from "./Tweet";

// import { PROPS_POST } from "../types";

interface PROPS_TIMELINE {
  tweetText: string;
  voiceUrl: string;
  createdAt: string;
}

// const useStyles = makeStyles((theme) => ({
//   small: {
//     width: theme.spacing(3),
//     height: theme.spacing(3),
//     marginRight: theme.spacing(1),
//   },
// }));

export const Timeline: React.FC = () => {
  const dispatch = useDispatch();
  const timelines = useSelector(selectTimeline);
  const currentTrackIndex = useSelector(selectCurrentTrackIndex);

  const handleClickProvious = () => {
    const index =
      currentTrackIndex === 0 ? timelines.length - 1 : currentTrackIndex - 1;
    dispatch(setCurrentTrackIndex(index));
  };

  const handleClickNext = () => {
    const index =
      currentTrackIndex < timelines.length - 1 ? currentTrackIndex + 1 : 0;
    dispatch(setCurrentTrackIndex(index));
  };

  const handleTrackEnd = () => {
    if (currentTrackIndex !== timelines.length - 1) {
      const index = currentTrackIndex + 1;
      dispatch(setCurrentTrackIndex(index));
    }
  };
  return (
    <>
      <AudioPlayer
        src={timelines[currentTrackIndex].tweetContent.voiceUrl}
        autoPlayAfterSrcChange={true}
        showSkipControls={true}
        showJumpControls={false}
        onClickPrevious={() => handleClickProvious()}
        onClickNext={() => handleClickNext()}
        onEnded={() => handleTrackEnd()}
      />

      {timelines.map((timeline, index) => (
        <Tweet
          index={index}
          tweetText={timeline.tweetContent.tweetText}
          createdAt={timeline.tweetContent.createdAt}
        />
      ))}
    </>
  );
};

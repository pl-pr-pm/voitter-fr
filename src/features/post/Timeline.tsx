import React, { useEffect, useState, useCallback } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import styles from "./Timeline.module.css";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import {
  selectTimeline,
  selectCurrentTrackIndex,
  setCurrentTrackIndex,
  selectUserInfo,
} from "./timelineSlice";
import { Tweet } from "./Tweet";
import { TimelineUserInfo } from "./TimelineUserInfo";
import { Box, Grid } from "@material-ui/core";
interface PROPS_TIMELINE {
  tweetText: string;
  voiceUrl: string;
  createdAt: string;
}

export const Timeline: React.FC = () => {
  const [init, setInit] = useState(false);
  // 初期レンダリング時のみtrueとする
  useEffect(() => {
    setInit(true);
  }, []);
  const dispatch = useDispatch();
  const timelines = useSelector(selectTimeline);
  const currentTrackIndex = useSelector(selectCurrentTrackIndex);
  const userInfo = useSelector(selectUserInfo);

  const scrollToRef = (
    index: number,
    currentTrackIndex: number,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (index === currentTrackIndex - 3) {
      ref && ref.current && ref.current.scrollIntoView();
    }
  };

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
    setInit(false);
    setTimeout(() => {
      if (currentTrackIndex !== timelines.length - 1) {
        const index = currentTrackIndex + 1;
        dispatch(setCurrentTrackIndex(index));
      }
    }, 1200); //1200ms 感覚で再生
  };
  return (
    <>
      <Box
        component="div"
        className={styles.timeline_container}
        m={5}
        p={1}
        height="50%"
        justify-content="space-around"
      >
        <Grid container direction="column" justifyContent="center" spacing={2}>
          {timelines.map((timeline, index) => (
            <Grid item>
              <Tweet
                index={index}
                tweetText={timeline.tweetContent.tweetText}
                createdAt={timeline.tweetContent.createdAt}
                setRef={scrollToRef}
              />
            </Grid>
          ))}
        </Grid>
        {userInfo.username ? (
          <Box component="div" ml={2} width="35%" height="75%">
            <TimelineUserInfo />
          </Box>
        ) : (
          <div></div>
        )}
      </Box>

      <Box className={styles.timeilne_player}>
        <AudioPlayer
          src={timelines[currentTrackIndex].tweetContent.voiceUrl}
          autoPlayAfterSrcChange={init ? false : true} // timlineをselectしたタイミングで再生しないように制御
          showSkipControls={true}
          showJumpControls={false}
          onClickPrevious={() => handleClickProvious()}
          onClickNext={() => handleClickNext()}
          onEnded={() => handleTrackEnd()}
        />
      </Box>
    </>
  );
};

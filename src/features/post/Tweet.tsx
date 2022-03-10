import { Box, Paper } from "@material-ui/core";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentTrackIndex,
  selectCurrentTrackIndex,
  setCurrentRef,
  selectCurrentRef,
} from "./timelineSlice";
import styles from "./Tweet.module.css";
export const Tweet: React.FC<{
  index: number;
  tweetText: string;
  createdAt: string;
  setRef: (
    index: number,
    currentTrackIndex: number,
    ref: React.RefObject<HTMLDivElement>
  ) => void;
}> = ({ index, tweetText, createdAt, setRef }) => {
  const dispatch = useDispatch();
  const currentTrackIndex = useSelector(selectCurrentTrackIndex);
  // const ref = useSelector(selectCurrentRef);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("in callback");
    if (index === currentTrackIndex + 2) {
      setRef(index, currentTrackIndex, ref);
    }
    // if (index === currentTrackIndex + 1) {
    //   setRef(ref);
    //   console.log(ref);
    // }
  }, [index, currentTrackIndex, ref]);

  // {index !== (currentTrackIndex + 1) &&
  //   <div ref={ref}></div>
  // }
  return (
    <>
      {index === currentTrackIndex + 2 ? (
        <div id="scroll" ref={ref}></div>
      ) : (
        <div></div>
      )}
      {/* <div ref={ref}></div> */}
      {tweetText ? (
        <Paper
          className={
            index === currentTrackIndex
              ? styles.tweet_continerHit
              : styles.tweet_continerNonHit
          }
          elevation={index === currentTrackIndex ? 10 : 3}
          onClick={() => dispatch(setCurrentTrackIndex(index))}
        >
          {tweetText}
          <br />
          <small className={styles.tweet_time}>ツイート日時@{createdAt}</small>
        </Paper>
      ) : (
        <Paper></Paper>
      )}
    </>
  );
};

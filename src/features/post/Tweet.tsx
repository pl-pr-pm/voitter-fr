import { Box, Paper } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrackIndex, selectCurrentTrackIndex } from "./timelineSlice";
import styles from "./Tweet.module.css";
export const Tweet: React.FC<{
  index: number;
  tweetText: string;
  createdAt: string;
}> = ({ index, tweetText, createdAt }) => {
  const dispatch = useDispatch();
  const currentTrackIndex = useSelector(selectCurrentTrackIndex);
  return (
    <>
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

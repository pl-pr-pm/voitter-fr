import { Paper } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrackIndex, selectCurrentTrackIndex } from "./timelineSlice";
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (index === currentTrackIndex - 3) {
      setRef(index, currentTrackIndex, ref);
    }
  }, [index, currentTrackIndex, ref]);

  return (
    <>
      <div ref={ref}></div>
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

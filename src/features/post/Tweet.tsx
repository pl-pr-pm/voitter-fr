import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentTrackIndex } from "./timelineSlice";
export const Tweet: React.FC<{
  index: number;
  tweetText: string;
  createdAt: string;
}> = ({ index, tweetText, createdAt }) => {
  const dispatch = useDispatch();
  return (
    <div onClick={() => dispatch(setCurrentTrackIndex(index))}>
      {tweetText}
      <br />
      {createdAt}
    </div>
  );
};

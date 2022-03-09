import { Avatar } from "@material-ui/core";

import { useSelector } from "react-redux";

import React from "react";
import { selectUserInfo } from "./timelineSlice";

export const TimelineUserInfo = () => {
  const userInfo = useSelector(selectUserInfo);
  return (
    <div className="userinfoContiener">
      <Avatar src={userInfo.profile_image_url} />
      <p>{userInfo.username}</p>
      <article>{userInfo.description}</article>
    </div>
  );
};

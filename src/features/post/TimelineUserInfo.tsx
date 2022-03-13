import { Avatar, Card, CardContent, Typography } from "@material-ui/core";

import { useSelector } from "react-redux";

import React from "react";
import { selectUserInfo } from "./timelineSlice";

export const TimelineUserInfo = () => {
  const userInfo = useSelector(selectUserInfo);
  const targetUrl = `https://twitter.com/${userInfo.username}`;
  return (
    <Card className="userinfoContiener">
      <CardContent>
        <a href={targetUrl}>
          <Avatar src={userInfo.profile_image_url} />
        </a>
        <Typography component="h2">{userInfo.username}</Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {userInfo.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

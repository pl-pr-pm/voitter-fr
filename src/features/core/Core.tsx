import React, { useEffect } from "react";
import Header from "../../components/Header/Header";

import styles from "./Core.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import { withStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";

import {
  selectTimeline,
  selectUserInfo,
  fetchAsyncGetTimeline,
  fetchAsyncGetTimelineTranslate,
  fetchAsyncGetUserInfo,
  selectIsLoadingTimeline,
  setTimelineStart,
  setTimelineEnd,
} from "../post/timelineSlice";
import { Timeline } from "../post/Timeline";
import ProfileModal from "../../components/ProfileModal/ProfileModal";

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const timelines = useSelector(selectTimeline);
  const userInfo = useSelector(selectUserInfo);
  const isLoadingTimeline = useSelector(selectIsLoadingTimeline);

  useEffect(() => {
    const fetchBootLoader = async () => {};
    fetchBootLoader();
  }, []);

  return (
    <div>
      <Header />
      <ProfileModal />
      <Timeline/>
    </div>
  );
};

export default Core;

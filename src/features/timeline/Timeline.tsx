import React, { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import styles from "./Timeline.module.css";

import { useSelector, useDispatch } from "react-redux";

import {
  selectTimeline,
  selectCurrentTrackIndex,
  setCurrentTrackIndex,
  selectUserInfo,
  selectUntilId,
  selectIsTranslate,
  fetchAsyncGetTimeline,
  fetchAsyncGetTimelineTranslate,
  selectIsLoadingTimeline,
  selectIsEmptyTimeline,
} from "./timelineSlice";
import { Tweet } from "./Tweet";
import { TimelineUserInfo } from "./TimelineUserInfo";
import { Box, Grid, CircularProgress } from "@material-ui/core";

export const Timeline: React.FC = () => {
  const [init, setInit] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [voiceIsLoading, setVoiceIsLoading] = useState(false);
  const dispatch = useDispatch();
  const timelines = useSelector(selectTimeline);
  const currentTrackIndex = useSelector(selectCurrentTrackIndex);
  const userInfo = useSelector(selectUserInfo);
  const untilId = useSelector(selectUntilId);
  const isTranslate = useSelector(selectIsTranslate);
  const isLoading = useSelector(selectIsLoadingTimeline);
  const isEmptyTimeline = useSelector(selectIsEmptyTimeline);

  // 初期レンダリング時のみtrueとする
  useEffect(() => {
    setInit(true);
  }, [timelines]);

  const scrollToRef = (
    index: number,
    currentTrackIndex: number,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    // 画面トップにスクロールされるため、
    // 各Tweet要素が再生された後に３つの要素が再生されたタイミングでスクロール
    // 可能であれば、px? rem? 等で算出したいが、Tweet要素のサイズも変更するので、３という感覚的な値とする
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
    }, 2000); //2000ms 間隔で再生
  };

  const handlePlay = () => {
    // この値は感覚
    // バックエンド側で、S3にアップロード後、複数の地点にレプリケーションするため、バックエンド側ではオブジェクトを作成できていても、クライアント側でアクセスすると未作成で403となる
    // 余裕を持って、この数字とした
    if (currentTrackIndex === timelines.length - 4) {
      if (isTranslate) {
        // 追加のtimelinesを取得する
        dispatch(
          fetchAsyncGetTimelineTranslate({
            username: userInfo.username,
            untilId: untilId,
          })
        );
      } else {
        dispatch(
          fetchAsyncGetTimeline({
            username: userInfo.username,
            untilId: untilId,
          })
        );
      }
    }
  };

  const handleOnError = () => {
    const originalIndex = currentTrackIndex;
    setLoadError(true);
    setVoiceIsLoading(true);
    // 以下、ダサいが・・・
    // S3に作成されたpollyのmp3ファイルがS3によってレプリケーションされるため、作成後すぐに取得することができない
    // そのため、mp3の再生を試みるとエラーとなる
    // react-h5-audio-playerには、再生失敗時のリトライ機能は備わっていないため以下自作している
    // 設定で、srcの変更時に自動再生としており、これを利用しsrcのindexを一時的に変更し元に戻すことで、mp3取得処理再実施する
    setTimeout(() => {
      dispatch(setCurrentTrackIndex(1));
      dispatch(setCurrentTrackIndex(originalIndex));
      setVoiceIsLoading(false);
    }, 5000);
  };

  const handleOnLoaded = () => {
    if (loadError) {
      setLoadError(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <Box className={styles.timeline_progress}>
            <CircularProgress />
          </Box>
        </>
      ) : (
        <Box
          component="div"
          className={styles.timeline_container}
          m={5}
          mb={10}
          p={1}
          height="50%"
          justify-content="space-around"
        >
          <Grid
            container
            direction="column"
            justifyContent="center"
            spacing={2}
          >
            {timelines.map((timeline, index) => (
              <Grid item key={index}>
                <Tweet
                  index={index}
                  tweetText={timeline.tweetContent.tweetText}
                  createdAt={timeline.tweetContent.createdAt}
                  setRef={scrollToRef}
                />
              </Grid>
            ))}

            {/* 対象ユーザーのtimelineが一件も取得できなかった場合 */}
            {isEmptyTimeline && timelines[0]._id === "" && (
              <p style={{ color: "indianred" }}>
                Tweetは取得できませんでした。対象ユーザーのTweetが存在するか確認してください。
              </p>
            )}
            {/* 対象ユーザーのtimelineが追加で取得できない場合 */}
            {isEmptyTimeline && timelines[0]._id !== "" && (
              <p style={{ color: "greenyellow", textAlign: "center" }}>
                最後のTweetです
              </p>
            )}
          </Grid>

          {userInfo.username ? (
            <Box
              component="div"
              ml={2}
              width="35%"
              height="75%"
              className={styles.timeline_userinfo}
            >
              <TimelineUserInfo />
            </Box>
          ) : (
            <div></div>
          )}
        </Box>
      )}

      <Box className={styles.timeilne_player}>
        {loadError && (
          <p style={{ color: "red" }}>
            音声読み込み中です。何度か再生ボタンをクリックしてください。
          </p>
        )}
        {voiceIsLoading ? (
          <Box className={styles.timeline_voice_progress}>
            <CircularProgress />
          </Box>
        ) : (
          <AudioPlayer
            src={timelines[currentTrackIndex].tweetContent.voiceUrl}
            autoPlayAfterSrcChange={init || isLoading ? false : true} // timlineをselectしたタイミングで再生しないように制御
            showSkipControls={true}
            showJumpControls={false}
            showDownloadProgress={true}
            volume={0.5}
            onClickPrevious={() => handleClickProvious()}
            onClickNext={() => handleClickNext()}
            onEnded={() => handleTrackEnd()}
            onPlay={() => handlePlay()}
            onPlayError={() => handleOnError()}
            onLoadedData={() => handleOnLoaded()}
          />
        )}
      </Box>
    </>
  );
};

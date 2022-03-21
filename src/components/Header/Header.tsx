import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Avatar,
  Button,
  IconButton,
  TextField,
  Switch,
  Tooltip,
} from "@material-ui/core";

import SearchIcon from "@mui/icons-material/Search";
import TranslateIcon from "@mui/icons-material/Translate";

import { useSelector, useDispatch } from "react-redux";

import {
  selectLoginuser,
  setOpenProfile,
  selectProfile,
  fetchAsyncGetProf,
  setOpenSignIn,
} from "../../features/auth/authSlice";

import {
  setTimelineStart,
  setTimelineEnd,
  selectIsLoadingTimeline,
  fetchAsyncGetTimeline,
  fetchAsyncGetUserInfo,
  setCurrentTrackIndex,
  fetchAsyncGetTimelineTranslate,
  setIsTranslate,
  selectIsTranslate,
  setUntilId,
  resetIsEmptyTimeline,
} from "../../features/timeline/timelineSlice";

import { validationInput } from "../../features/util/validation";

import styles from "./Header.module.css";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const loginUser = useSelector(selectLoginuser);
  const loading = useSelector(selectIsLoadingTimeline);
  const isTranslate = useSelector(selectIsTranslate);
  const [usernameError, setUsernameError] = useState<string | undefined>("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [translateMessage, setTranslateMessage] = useState("");

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (loginUser) {
        await dispatch(fetchAsyncGetProf()); // profile取得
      }
    };
    fetchBootLoader();
  }, [loginUser]);

  useEffect(() => {
    if (!loginUser) {
      setTranslateMessage(
        "タイムライン検索時、対象のユーザのツイートを日本語に翻訳します。ログイン後、翻訳機能の使用が可能となります。"
      );
    } else {
      if (!isTranslate) {
        setTranslateMessage("日本語への翻訳可能");
      } else {
        setTranslateMessage("日本語への翻訳有効中");
      }
    }
  }, [loginUser, isTranslate]);

  const searchTimeline = async () => {
    // 別ユーザーのtimelinesを取得するため、untilIdとcurrentindexを初期状態とする
    const firstFetchUntilId = "0000000000";
    // isEmptyTimelineをfalseとし、timelineの末尾でのメッセージ出力を抑える
    dispatch(resetIsEmptyTimeline());
    dispatch(setUntilId(firstFetchUntilId));
    dispatch(setTimelineStart());
    dispatch(setCurrentTrackIndex(0));
    await dispatch(fetchAsyncGetUserInfo(searchText));
    if (isTranslate) {
      await dispatch(
        fetchAsyncGetTimelineTranslate({
          username: searchText,
          untilId: firstFetchUntilId,
        })
      );
    } else {
      await dispatch(
        fetchAsyncGetTimeline({
          username: searchText,
          untilId: firstFetchUntilId,
        })
      );
    }
    await dispatch(setCurrentTrackIndex(0));
    dispatch(setTimelineEnd());
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    // error 判定のため、state更新後ではなく、validationInputの返却値を利用する
    const localUsernameError = validationInput("username", searchText);
    setUsernameError(localUsernameError);
    const error = localUsernameError ? true : false;
    setIsUsernameError(error);
  };

  return (
    <>
      <div className={styles.header_container}>
        <h1 className={styles.header_title}>Voitter</h1>
        <div className={styles.header_searchBox}>
          <TextField
            className={styles.header_input}
            variant="outlined"
            type="text"
            placeholder="Please input username after @ (@999voitter -> 999voitter) "
            value={searchText}
            onChange={handleUsernameChange}
            error={isUsernameError}
            helperText={usernameError}
          />

          <IconButton
            disabled={loading || searchText.length === 0 || isUsernameError}
            onClick={searchTimeline}
          >
            <SearchIcon />
          </IconButton>
        </div>
        <div>
          <Tooltip title={translateMessage}>
            <div className={styles.header_tooltip}>
              <TranslateIcon />
              <Switch
                color="primary"
                disabled={!loginUser}
                checked={isTranslate}
                onChange={() => dispatch(setIsTranslate(!isTranslate))}
              />
            </div>
          </Tooltip>
        </div>

        <div className={styles.header_avatar}>
          <p
            onClick={() => {
              loginUser
                ? dispatch(setOpenProfile())
                : dispatch(setOpenSignIn());
            }}
          >
            {loginUser ? (
              <Avatar src={profile.imageUrl} />
            ) : (
              <Button className={styles.header_loginButton}>Login</Button>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;

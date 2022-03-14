import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Avatar,
  Button,
  IconButton,
  TextField,
  Switch,
  FormGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLoginuser,
  setOpenProfile,
  selectProfile,
  fetchAsyncGetProf,
  setOpenSignIn,
} from "../Header/authSlice";

import { validationInput } from "../../features/util/validation";

import SearchIcon from "@mui/icons-material/Search";
import styles from "./Header.module.css";

import {
  setTimelineStart,
  setTimelineEnd,
  selectIsLoadingTimeline,
  selectTargetUsername,
  fetchAsyncGetTimeline,
  fetchAsyncGetUserInfo,
  setCurrentTrackIndex,
  fetchAsyncGetTimelineTranslate,
  setIsTranslate,
  selectIsTranslate,
  setUntilId,
} from "../../features/timeline/timelineSlice";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const loginUser = useSelector(selectLoginuser);
  const targetUsername = useSelector(selectTargetUsername);
  const loading = useSelector(selectIsLoadingTimeline);
  // const [isTranslate, setIsTranslate] = useState(false);
  const isTranslate = useSelector(selectIsTranslate);
  const [usernameError, setUsernameError] = useState<string | undefined>("");
  const [isUsernameError, setIsUsernameError] = useState(false);

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (loginUser) {
        await dispatch(fetchAsyncGetProf()); // profile取得
      }
    };
    fetchBootLoader();
  }, [loginUser]);

  const searchTimeline = async () => {
    // 別ユーザーのtimelinesを取得するため、untilIdとcurrentindexを初期状態とする
    const firstFetchUntilId = "0000000000";
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
            placeholder="Please input username after @ (@test -> test) "
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
        <FormControl component="fieldset" className={styles.header_switch}>
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="Translate"
              control={
                <Switch
                  color="primary"
                  disabled={!loginUser}
                  checked={isTranslate}
                  onChange={() => dispatch(setIsTranslate(!isTranslate))}
                />
              }
              label="TRANSLATE"
              labelPlacement="start"
            />
          </FormGroup>
        </FormControl>

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

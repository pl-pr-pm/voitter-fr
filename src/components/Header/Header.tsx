import React, { useEffect, useState } from "react";
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

import SearchIcon from "@mui/icons-material/Search";
import styles from "./Header.module.css";

import {
  editTargetUsername,
  selectTargetUsername,
  fetchAsyncGetTimeline,
  fetchAsyncGetUserInfo,
  setCurrentTrackIndex,
} from "../../features/post/timelineSlice";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const loginUser = useSelector(selectLoginuser);
  const targetUsername = useSelector(selectTargetUsername);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (loginUser) {
        await dispatch(fetchAsyncGetProf()); // profile取得
      }
    };
    fetchBootLoader();
  }, [loginUser]);

  const searchTimeline = async () => {
    await dispatch(fetchAsyncGetUserInfo(searchText));
    await dispatch(fetchAsyncGetTimeline(searchText));
    await dispatch(setCurrentTrackIndex(0));
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
            placeholder="Please Input username"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <IconButton onClick={searchTimeline}>
            <SearchIcon />
          </IconButton>
        </div>
        <FormControl component="fieldset" className={styles.header_switch}>
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="Translate"
              control={
                <Switch
                  disabled={!loginUser}
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />
              }
              label="TRANSLATE"
              labelPlacement="start"
            />
          </FormGroup>
        </FormControl>

        <div className="Avator">
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

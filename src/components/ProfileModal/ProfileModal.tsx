import React, { ChangeEvent, useState } from "react";
import Modal from "react-modal";
import styles from "./ProfileModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { validationInput } from "../../features/util/validation";

import {
  selectOpenProfile,
  selectOpenSignIn,
  selectOpenSignUp,
  resetOpenProfile,
  selectIsLoadingAuth,
  fetchAsyncUpdateProf,
  setOpenSignUp,
  setOpenSignIn,
  resetOpenSignUp,
  resetOpenSignIn,
  fetchAsyncLogin,
  fetchAsyncSignup,
  selectOpenLogout,
  setOpenLogout,
  resetOpenLogout,
  fetchAsyncLogout,
  fetchCredStart,
  fetchCredEnd,
} from "../../features/auth/authSlice";

import { Button, TextField, IconButton } from "@material-ui/core";
import { MdAddPhotoAlternate } from "react-icons/md";

const customStyles = {
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 220,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const ProfileModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openProfile = useSelector(selectOpenProfile);
  const openSignIn = useSelector(selectOpenSignIn);
  const openSignUp = useSelector(selectOpenSignUp);
  const openLogout = useSelector(selectOpenLogout);
  const loading = useSelector(selectIsLoadingAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string | undefined>("");
  const [passwordError, setPasswordError] = useState<string | undefined>("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [image, setImage] = useState<File | string>("");

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };
  const handleUpdateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const isImageChange = image ? "true" : "false";
    const params = new FormData();
    params.append("username", username);
    if (image) {
      params.append("img", image);
    }
    params.append("isImageChange", isImageChange);

    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncUpdateProf(params));
    await dispatch(fetchCredEnd());
    await dispatch(resetOpenProfile());
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setUsername(username);
    // error 判定のため、state更新後ではなく、validationInputの返却値を利用する
    const localUsernameError = validationInput("username", username);
    setUsernameError(localUsernameError);
    const error = localUsernameError ? true : false;
    setIsUsernameError(error);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);
    const localPasswordError = validationInput("password", password);
    setPasswordError(localPasswordError);
    const error = localPasswordError ? true : false;
    setIsPasswordError(error);
  };

  const handleSignIn = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const signIn = async () => {
      const packet = { username: username, password: password };
      await dispatch(fetchCredStart());
      await dispatch(fetchAsyncLogin(packet));
      await dispatch(fetchCredEnd());
      await dispatch(resetOpenSignIn());
    };
    signIn();
  };

  const handleSignUp = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const signUp = async () => {
      const packet = { username: username, password: password };
      await dispatch(fetchCredStart());
      try {
        await dispatch(fetchAsyncSignup(packet));
      } catch (e: any) {
        await dispatch(fetchCredEnd());
        await dispatch(resetOpenSignUp());
      }
      if (!e) {
        await dispatch(fetchCredEnd());
        await dispatch(fetchAsyncLogin(packet));
        await dispatch(resetOpenSignUp());
      }
    };
    signUp();
  };

  const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const logOut = async () => {
      await dispatch(fetchCredStart());
      await dispatch(fetchAsyncLogout());
      await dispatch(fetchCredEnd());
      await dispatch(resetOpenLogout());
    };
    logOut();
  };

  return (
    <>
      <Modal
        isOpen={openSignIn}
        onRequestClose={async () => {
          await dispatch(resetOpenSignIn());
        }}
        style={customStyles}
      >
        {
          <form className={styles.profileModal_signUp}>
            <h1 className={styles.profileModal_title}>Voitter</h1>
            <br />
            <TextField
              placeholder="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />

            <TextField
              placeholder="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {usernameError && (
              <p style={{ color: "red", fontSize: 8 }}>{usernameError}</p>
            )}
            {passwordError && (
              <p style={{ color: "red", fontSize: 8 }}>{passwordError}</p>
            )}

            <Button
              disabled={
                username.length === 0 ||
                password.length === 0 ||
                isUsernameError ||
                isPasswordError ||
                loading
              }
              className={styles.profileModal_btnModal}
              variant="outlined"
              color="primary"
              type="submit"
              onClick={handleSignIn}
            >
              SignIn
            </Button>
            <br />
            <span
              className={styles.profileModal_btnSpan}
              onClick={async () => {
                await dispatch(setOpenSignUp());
                await dispatch(resetOpenSignIn());
              }}
            >
              Create new Account?
            </span>
          </form>
        }
      </Modal>
      <Modal
        isOpen={openProfile}
        onRequestClose={async () => {
          await dispatch(resetOpenProfile());
        }}
        style={customStyles}
      >
        {
          <form className={styles.profileModal_signUp}>
            <h1 className={styles.profileModal_title}>Voitter</h1>

            <br />
            <TextField
              placeholder="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
            {usernameError && (
              <p style={{ color: "red", fontSize: 8 }}>{usernameError}</p>
            )}
            <input
              type="file"
              id="imageInput"
              hidden={true}
              onChange={(e) => setImage(e.target.files![0])}
            />

            <IconButton onClick={handlerEditPicture}>
              <MdAddPhotoAlternate />
            </IconButton>
            <Button
              disabled={username.length === 0 || isUsernameError || loading}
              className={styles.profileModal_btnModal}
              variant="outlined"
              color="primary"
              type="submit"
              onClick={handleUpdateProfile}
            >
              Update
            </Button>
            <br />
            <span
              className={styles.profileModal_btnSpan}
              onClick={async () => {
                await dispatch(setOpenLogout());
                await dispatch(resetOpenProfile());
              }}
            >
              Logout?
            </span>
          </form>
        }
      </Modal>
      <Modal
        isOpen={openSignUp}
        onRequestClose={async () => {
          await dispatch(resetOpenSignUp());
        }}
        style={customStyles}
      >
        {
          <form className={styles.profileModal_signUp}>
            <h1 className={styles.profileModal_title}>Voitter</h1>

            <br />
            <TextField
              placeholder="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />

            <TextField
              placeholder="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {usernameError && (
              <p style={{ color: "red", fontSize: 8 }}>{usernameError}</p>
            )}
            {passwordError && (
              <p style={{ color: "red", fontSize: 8 }}>{passwordError}</p>
            )}
            <Button
              disabled={
                username.length === 0 ||
                password.length === 0 ||
                isUsernameError ||
                isPasswordError ||
                loading
              }
              variant="outlined"
              color="primary"
              className={styles.profileModal_btnModal}
              onClick={handleSignUp}
            >
              SignUp
            </Button>
            <br />
            <span
              className={styles.profileModal_btnSpan}
              onClick={async () => {
                await dispatch(setOpenSignIn());
                await dispatch(resetOpenSignUp());
              }}
            >
              You already have an account?
            </span>
          </form>
        }
      </Modal>
      <Modal
        isOpen={openLogout}
        onRequestClose={async () => {
          await dispatch(resetOpenLogout());
        }}
        style={customStyles}
      >
        {
          <form className={styles.profileModal_signUp}>
            <h1 className={styles.profileModal_title}>Voitter</h1>

            <br />
            <Button
              disabled={loading}
              variant="outlined"
              className={styles.profileModal_btnModal}
              onClick={handleLogout}
            >
              Logout
            </Button>
            <br />
            <span
              className={styles.profileModal_btnSpan}
              onClick={async () => {
                await dispatch(setOpenSignUp());
                await dispatch(resetOpenLogout());
              }}
            >
              Create new Account?
            </span>
          </form>
        }
      </Modal>
    </>
  );
};

export default ProfileModal;

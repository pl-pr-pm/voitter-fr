import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./ProfileModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

// import { File } from "../types";

import {
  selectOpenProfile,
  selectOpenSignIn,
  selectOpenSignUp,
  resetOpenProfile,
  selectProfile,
  editUsername,
  editPassword,
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
} from "../Header/authSlice";

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
  const profile = useSelector(selectProfile);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

    // await dispatch(fetchCredStart());
    await dispatch(fetchAsyncUpdateProf(params));
    // await dispatch(fetchCredEnd());
    await dispatch(resetOpenProfile());
  };

  const handleSignIn = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const signIn = async () => {
      const packet = { username: username, password: password };
      await dispatch(fetchAsyncLogin(packet));
      await dispatch(resetOpenSignIn());
    };
    signIn();
  };

  const handleSignUp = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const signUp = async () => {
      const packet = { username: username, password: password };
      await dispatch(fetchAsyncSignup(packet));
      await dispatch(fetchAsyncLogin(packet));
    };
    signUp();
  };

  const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const logOut = async () => {
      await dispatch(fetchAsyncLogout());
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
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
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
              onChange={(e) => setUsername(e.target.value)}
            />

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
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
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

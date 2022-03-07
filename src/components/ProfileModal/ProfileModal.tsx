import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./Core.module.css";
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

// interface CFormData extends FormData {
//   append(name: string, value: string | File | boolean): void;
// }

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
    // const packet = {
    //   username: username,
    //   image: image,
    //   isImageChange: isImageChange,
    // };
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
          <form className={styles.core_signUp}>
            <h1 className={styles.core_title}>Voitter</h1>

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
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSignIn}
            >
              SignIn
            </Button>
            <span
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
          <form className={styles.core_signUp}>
            <h1 className={styles.core_title}>Voitter</h1>

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
            <br />
            <IconButton onClick={handlerEditPicture}>
              <MdAddPhotoAlternate />
            </IconButton>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleUpdateProfile}
            >
              Edit
            </Button>
            <span
              onClick={async () => {
                await dispatch(setOpenSignUp());
                await dispatch(resetOpenProfile());
              }}
            >
              Create new Account?
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
          <form className={styles.core_signUp}>
            <h1 className={styles.core_title}>Voitter</h1>

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
            <Button variant="contained" color="primary" onClick={handleSignUp}>
              SignUp
            </Button>
            <span
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
    </>
  );
};

export default ProfileModal;

import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLoginuser,
  setOpenProfile,
  selectProfile,
  fetchAsyncGetProf,
  setOpenSignIn,
} from "../Header/authSlice";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const profile = useSelector(selectProfile);

  const loginUser = useSelector(selectLoginuser);

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (loginUser) {
        await dispatch(fetchAsyncGetProf()); // profile取得
        await setlProfile(profile);
      }
    };
    fetchBootLoader();
  }, [loginUser]);
  return (
    <>
      <h1 className="title">Voitter</h1>
      <div className="searchBox">
        <input
          type="text"
          placeholder="Please Input username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button>SEARCH</button>
      </div>
      <div className="Avator">
        <p
          onClick={() => {
            loginUser ? dispatch(setOpenProfile()) : dispatch(setOpenSignIn());
          }}
        >
          {loginUser ? (
            <Avatar src={profile.imageUrl} />
          ) : (
            <button>Login</button>
          )}
        </p>
      </div>
    </>
  );
};

export default Header;

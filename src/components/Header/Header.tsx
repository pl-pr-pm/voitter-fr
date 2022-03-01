import React, { useEffect, useState } from "react";
import { Button, Avatar } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { setOpenProfile } from "../Header/authSlice";

const Header = () => {
  const [username, setUsername] = useState("");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {});
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
        <button
          onClick={() => {
            dispatch(setOpenProfile());
          }}
        >
          <Avatar src="/Users/Ryo_Ito/work/voitter-fr/public/favicon.ico" />
        </button>
      </div>
    </>
  );
};

export default Header;

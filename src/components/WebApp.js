import React, { useEffect, useState } from "react";
// import SpotifyGetPlaylists from "./components/SpotifyGetPlaylists/SpotifyGetPlaylists";
// import "./WebApp.css";
import "../App.css";
import Main from "./Main";
import { Link } from "react-router-dom";

const CLIENT_ID = "829c02a24c1344fd8dc606ac3c0663c5"; // insert your client id here from spotify
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/";
const SPACE_DELIMITER = "%20";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-read-private",
  "user-top-read",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

/* 
http://localhost:3000/webapp#access_token=ABCqxL4Y&token_type=Bearer&expires_in=3600
*/
const getReturnedParamsFromSpotifyAuth = (hash) => {
  // console.log(hash);
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    // console.log(currentValue);
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});

  return paramsSplitUp;
};

const WebApp = () => {
  const [login, setlogin] = useState(false);
  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type, id } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);

      localStorage.clear();

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
      setlogin(true);
    }
  }, []);

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  // const logout = () => {
  //   console.log("logout");
  //   localStorage.clear();
  //   setlogin(false);
  // };

  return (
    <div>
      {login ? (
        <div className="Main">
          {/* <button className="logout" onClick={logout}>
            Log out
          </button> */}
          <Main />
        </div>
      ) : (
        <div className="Logo">
          <div>
            <h1>My.</h1>
            <br />
            <h1>Generator</h1>
            <p>
              Analyse your music and give recommendations
              <br /> based on selected characteristics
            </p>

            <button className="Login" onClick={handleLogin}>
              login to spotify
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebApp;

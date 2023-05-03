import React, { useEffect, useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import { InputGroup, FormControl } from "react-bootstrap";
import play from "../icons/playIcon.png";

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// save selected values
// description of table elements
// next page function
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const TOP_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks?";
const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search?q=";

const Main = () => {
  const [token, setToken] = useState("");
  const [tops, setTop] = useState({});
  const [compareArtist, setCompareArtist] = useState([]);
  const [compareTrack, setCompareTrack] = useState([]);
  const [checkedState, setCheckedState] = useState(new Array(20).fill(false));
  const [checkedSearch, setCheckedSearch] = useState([false, false]);
  const [searchInput, setSearchInput] = useState({});
  const [search, setSearch] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(false);
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
      handleGetTop();
    }
    setDone(true);
  }, [token]);

  const handleGetTop = async () => {
    var topParams = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    {
      console.log("top");
    }
    await fetch(TOP_ENDPOINT, topParams)
      .then((response) => response.json())
      .then((data) => setTop(data));
  };

  const handleSearch = async () => {
    console.log("search");
    var artistParams = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    var artistID = await fetch(
      SEARCH_ENDPOINT + searchInput + "&type=track",
      artistParams
    )
      .then((response) => response.json())
      .then((data) => setSearch(data));
  };

  // clear compare parameters after submitted selected songs
  const handleSubmit = async (event) => {
    if (compareTrack.length < 2) {
      alert("Please select two songs");
      event.preventDefault();
    } else {
      setCompareArtist([]);
      setCompareTrack([]);
      setCheckedState(new Array(20).fill(false));
      event.preventDefault();
    }
  };

  // store selected songs when user clicking on the checkbox
  const handleChange = (position, event) => {
    // if (checkedState.filter((i) => i).length >= 2 && event.target.checked)
    //   return;
    // const updatedCheckedState = checkedState.map((item, index) =>
    //   index === position ? !item : item
    // );

    // setCheckedState(updatedCheckedState);
    // console.log(event.target.checked);
    if (event.target.checked) {
      console.log("add");
      setCompareArtist((prevState) => [
        ...prevState,
        event.target.value.split(",")[0],
      ]);
      setCompareTrack((prevState) => [
        ...prevState,
        event.target.value.split(",")[1],
      ]);
    } else {
      console.log("remove");
      setCompareArtist(
        compareArtist.filter(
          (compare) => compare !== event.target.value.split(",")[0]
        )
      );
      setCompareTrack(
        compareTrack.filter(
          (compare) => compare !== event.target.value.split(",")[1]
        )
      );
    }
    console.log(compareArtist);
  };

  const logout = () => {
    console.log("logout");
    localStorage.clear();
    // setlogin(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        paddingLeft: "20px",
        paddingTop: "20px",
        width: "100%",
        minHeight: "100%",
        backgroundColor: "#d1dbd5",
      }}
    >
      <div className="App" style={{ marginBottom: "50px" }}>
        {/* <button onClick={handleGetPlaylists}>Get Playlists</button>
        {data?.items ? data.items.map((item) => <p>{item.name}</p>) : null} */}
        <div className="inLine">
          <h1 style={{ color: "#034343" }}>Your Top 20 music</h1>
          <button onClick={handleGetTop}>Get Top 20</button>
          <button className="logout" onClick={logout}>
            <a href="/">Log out</a>
          </button>
        </div>

        <p style={{ color: "#034343" }}>· Pick any two music to compare</p>
        {done ? (
          <div className="inLine" style={{ alignItems: "start" }}>
            <form onSubmit={handleSubmit} style={{ flex: "3" }}>
              {tops?.items ? (
                <div className="MusicDisplay">
                  {tops.items.map((top, index) => (
                    <div className="MusicContainer">
                      <div className="Image">
                        <input
                          type="checkbox"
                          // id={`custom-checkbox-${index}`}
                          value={[top.artists[0].id, top.id]}
                          // checked={checkedState[index]}
                          checked={
                            compareTrack.indexOf(search.id) > -1 ? true : null
                          }
                          onChange={(e) => handleChange(index, e)}
                          disabled={
                            compareTrack.indexOf(top.id) <= -1 &&
                            compareTrack.length >= 2
                              ? "disabled"
                              : null
                          }
                        />

                        <img
                          src={top.album.images[0].url}
                          alt="cover"
                          width="200px"
                          height="200px"
                        />
                      </div>
                      <div className="Music">
                        <p>
                          {top.album.artists[0].name}
                          <br />
                          {top.name}
                        </p>
                        <Link to={top.external_urls.spotify} target="_blank">
                          <div className="playIcon">
                            <img src={play} alt="play" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
                {compareTrack.length < 2 ? (
                  "submit"
                ) : (
                  <Link
                    to="/compare"
                    state={{ compare: { compareArtist, compareTrack } }}
                  >
                    submit
                  </Link>
                )}
              </button>
            </form>
            <div className="SearchContainer" style={{ flex: "2" }}>
              <div className="inLine">
                <InputGroup>
                  <FormControl
                    className="SearchBar"
                    placeholder="Search For Artist"
                    type="input"
                    onKeyDown={(event) => {
                      if (event.key == "Enter") {
                        handleSearch();
                      }
                    }}
                    onChange={(event) => {
                      setSearchInput(event.target.value);
                    }}
                  />
                </InputGroup>
                <button onClick={handleSearch}>search</button>
              </div>
              {searchInput.length > 0 ? (
                <div
                  className="MusicDisplay"
                  style={{ gridTemplateColumns: "repeat(2, auto)" }}
                >
                  {search?.tracks
                    ? search.tracks.items.map((search, index) => (
                        <div className="MusicContainer">
                          <div className="Image">
                            <input
                              type="checkbox"
                              // id={`custom-checkbox-${index}`}
                              value={[search.artists[0].id, search.id]}
                              checked={
                                compareTrack.indexOf(search.id) > -1
                                  ? true
                                  : null
                              }
                              onChange={(e) => handleChange(index, e)}
                              disabled={
                                compareTrack.indexOf(search.id) <= -1 &&
                                compareTrack.length >= 2
                                  ? "disabled"
                                  : null
                              }
                            />
                            {/* {console.log(compareTrack)} */}

                            <img
                              src={search.album.images[0].url}
                              alt="cover"
                              width="200px"
                              height="200px"
                            />
                          </div>
                          <div className="Music">
                            <p>
                              {search.album.artists[0].name}
                              <br />
                              {search.name}
                            </p>
                            <Link
                              to={search.external_urls.spotify}
                              target="_blank"
                            >
                              <div className="playIcon">
                                <img src={play} alt="play" />
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              ) : (
                <p style={{ color: "#034343" }}>Search for more music</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading ... </p>
        )}
      </div>
    </div>
  );
};
export default Main;

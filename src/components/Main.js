import React, { useEffect, useState, componentDidMount } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import play from "../icons/playIcon.png";

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// save selected values
// description of table elements
// add search function
// next page function
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const TOP_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";

const Main = () => {
  const [token, setToken] = useState("");
  const [tops, setTop] = useState({});
  const [compareArtist, setCompareArtist] = useState([]);
  const [compareTrack, setCompareTrack] = useState([]);
  const [checkedState, setCheckedState] = useState(new Array(20).fill(false)); // For top 20 songs selections
  const [clickState, setClickState] = useState(new Array(20).fill(false)); // For recommendation cell selections

  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(false);
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
      handleGetTop();
    }
    setDone(true);
  }, [token]);

  // componentDidMount(() => {
  //   setTimeout(() => {
  //     handleGetTop();
  //   }, 2000);
  // });

  const handleGetTop = async () => {
    await axios
      .get(TOP_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
          // "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTop(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Get top error - " + error);
      });
  };

  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    if (checkedState.filter((i) => i).length >= 2 && event.target.checked)
      return;
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    if (event.target.checked) {
      setCompareArtist((prevState) => [
        ...prevState,
        event.target.value.split(",")[0],
      ]);
      setCompareTrack((prevState) => [
        ...prevState,
        event.target.value.split(",")[1],
      ]);
    } else {
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
      <div className="App">
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
          <form onSubmit={handleSubmit}>
            {tops?.items ? (
              <div className="MusicDisplay">
                {tops.items.map((top, index) => (
                  <div className="MusicContainer">
                    <div className="Image">
                      <input
                        type="checkbox"
                        id={`custom-checkbox-${index}`}
                        value={[top.artists[0].id, top.id]}
                        checked={checkedState[index]}
                        onChange={(e) => handleChange(index, e)}
                        disabled={
                          checkedState[index] === false &&
                          checkedState.filter((i) => i).length >= 2
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
                    {/* {console.log(top.album.artists[0].name)} */}
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
        ) : (
          <p>Loading ... </p>
        )}
      </div>
    </div>
  );
};
export default Main;

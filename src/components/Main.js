import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import play from "../icons/playIcon.png";

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// loading top 20 auto
// save selected values
// add loading text
// pop-up window for empty selection
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const TOP_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";

const Main = () => {
  const [token, setToken] = useState("");
  // const [data, setData] = useState({});
  const [tops, setTop] = useState({});
  // const [recommendations, setRecommendations] = useState({});
  // const [artist, setArtist] = useState([]);
  // const [track, setTrack] = useState([]);
  const [compareArtist, setCompareArtist] = useState([]);
  const [compareTrack, setCompareTrack] = useState([]);
  // const [audioAnalysis, setAudioAnalysis] = useState([]);
  const [checkedState, setCheckedState] = useState(new Array(20).fill(false)); // For top 20 songs selections
  const [clickState, setClickState] = useState(new Array(20).fill(false)); // For recommendation cell selections

  // const navigate = useNavigate();

  // const [select, setSelect] = useState({
  //   seed_artists: null,
  //   seed_genres: null,
  //   target_loudness: null,
  //   target_popularity: null,
  //   target_tempo: null,
  //   target_key: null,
  //   target_time_signature: null,
  // });

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
      // handleGetTop();
    }
  }, []);

  const handleGetTop = () => {
    axios
      .get(TOP_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
          // "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTop(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.log("Get top error - " + error);
      });
  };

  // const handleGetArtist = async (id) => {
  //   await axios
  //     .get(GET_ARTIST_ENDPOINT + id, {
  //       headers: {
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       setArtist((prevState) => [...prevState, response.data]);
  //       console.log("artist: " + artist);
  //       console.log(artist);
  //     })
  //     .catch((error) => {
  //       console.log("Get artist error - " + error);
  //     });
  // };

  // const handleGetTrack = async (id) => {
  //   await axios
  //     .get(GET_TRACK_ENDPOINT + id, {
  //       headers: {
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       setTrack((prevState) => [...prevState, response.data]);
  //       console.log("track: " + track);
  //       console.log(track);
  //     })
  //     .catch((error) => {
  //       console.log("Get track error - " + error);
  //     });
  // };

  // const handleAudioAnalysis = async (id) => {
  //   await axios
  //     .get(AUDIO_ANALYSIS_ENDPOINT + id, {
  //       headers: {
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       setAudioAnalysis((prevState) => [...prevState, response.data]);
  //     })
  //     .catch((error) => {
  //       console.log("Get audio analysis error - " + error);
  //     });
  // };

  // const handleRecommendation = () => {
  //   // console.log(select.genres);
  //   axios
  //     .get(RECOMMENDATION_ENDPOINT, {
  //       headers: {
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       },
  //       params: {
  //         limit: 10,
  //         seed_artists: select.seed_artists,
  //         seed_genres: select.seed_genres,
  //         target_loudness: select.target_loudness,
  //         target_popularity: select.target_popularity,
  //         target_tempo: select.target_tempo,
  //         target_key: select.target_key,
  //         target_time_signature: select.target_time_signature,
  //       },
  //     })
  //     .then((response) => {
  //       setRecommendations(response);
  //     })
  //     .catch((error) => {
  //       console.log("Get recommendation error - " + error);
  //     });
  //   console.log(recommendations);
  // };

  // const clickCell = (position) => {
  //   if (document.getElementById(position).innerText === "") {
  //     return null;
  //   }
  //   if (
  //     (position % 2 === 0 && !clickState[position + 1]) ||
  //     (position % 2 !== 0 && !clickState[position - 1])
  //   ) {
  //     const updatedClickState = clickState.map((state, index) =>
  //       index === position ? !state : state
  //     );
  //     setClickState(updatedClickState);
  //   } else if (position % 2 === 0 && clickState[position + 1]) {
  //     const updatedClickState = clickState.map((state, index) =>
  //       index === position || index === position + 1 ? !state : state
  //     );
  //     setClickState(updatedClickState);
  //   } else {
  //     const updatedClickState = clickState.map((state, index) =>
  //       index === position || index === position - 1 ? !state : state
  //     );
  //     setClickState(updatedClickState);
  //   }

  //   const cell = cellNum[position];
  //   if (!clickState[position]) {
  //     setSelect((prevState) => ({
  //       ...prevState,
  //       [cell]: document
  //         .getElementById(position)
  //         .innerHTML.replaceAll("<p>", "")
  //         .replaceAll("</p>", ","),
  //     }));
  //   } else {
  //     setSelect((prevState) => ({
  //       ...prevState,
  //       [cell]: null,
  //     }));
  //   }

  //   // console.log(clickState);
  //   // console.log(select);
  // };

  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // submit selected songs
  const handleSubmit = async (event) => {
    // compareArtist.map((compare) => handleGetArtist(compare));
    // compareTrack.map((compare) => handleGetTrack(compare));
    // compareTrack.map((compare) => handleAudioAnalysis(compare));
    // await delay(1000);
    // console.log(track);
    setCompareArtist([]);
    setCompareTrack([]);
    // setArtist([]);
    // setTrack([]);
    // setAudioAnalysis([]);
    setCheckedState(new Array(20).fill(false));
    event.preventDefault();
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

  return (
    <div
      style={{
        paddingLeft: "20px",
        paddingTop: "20px",
        width: "100%",
      }}
    >
      <div>
        {/* <button onClick={handleGetPlaylists}>Get Playlists</button>
        {data?.items ? data.items.map((item) => <p>{item.name}</p>) : null} */}
        <button onClick={handleGetTop}>Get Top 20</button>
        <h1 style={{ color: "white" }}>Your Top 20 music</h1>
        <p style={{ color: "white" }}>· Pick any two music to compare</p>
        <form onSubmit={handleSubmit}>
          {tops?.items ? (
            <div className="MusicDisplay">
              {tops.items.map((top, index) => (
                <div className="MusicContainer">
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
                  <div>
                    <img
                      src={top.album.images[0].url}
                      alt="cover"
                      width="200px"
                      height="200px"
                    />
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
                </div>
              ))}
            </div>
          ) : null}

          <button onClick={handleSubmit} to="/compare">
            <Link
              to="/compare"
              state={{ compare: { compareArtist, compareTrack } }}
            >
              submit
            </Link>
          </button>
          {/* <input type="submit" value="Submit" /> */}
        </form>
      </div>
    </div>
  );
};
export default Main;

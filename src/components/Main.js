import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import play from "../icons/playIcon.png";

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// pass value to compare.js
// loading top 20 auto
// add loading text
// pop-up window for empty selection
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// const access_token = localStorage.getItem("accessToken");
// const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const TOP_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";
const GET_ARTIST_ENDPOINT = "https://api.spotify.com/v1/artists/";
const GET_TRACK_ENDPOINT = "https://api.spotify.com/v1/tracks/";
const AUDIO_ANALYSIS_ENDPOINT = "https://api.spotify.com/v1/audio-analysis/";
const RECOMMENDATION_ENDPOINT = "https://api.spotify.com/v1/recommendations";

const cellNum = {
  0: "seed_artists",
  1: "seed_artists",
  2: "seed_genres",
  3: "seed_genres",
  4: "target_loudness",
  5: "target_loudness",
  6: "target_popularity",
  7: "target_popularity",
  8: "target_tempo",
  9: "target_tempo",
  10: "target_key",
  11: "target_key",
  12: "target_time_signature",
  13: "target_time_signature",
};

const Main = () => {
  const [token, setToken] = useState("");
  // const [data, setData] = useState({});
  const [tops, setTop] = useState({});
  const [recommendations, setRecommendations] = useState({});
  const [artist, setArtist] = useState([]);
  const [track, setTrack] = useState([]);
  const [compareArtist, setCompareArtist] = useState([]);
  const [compareTrack, setCompareTrack] = useState([]);
  const [audioAnalysis, setAudioAnalysis] = useState([]);
  const [checkedState, setCheckedState] = useState(new Array(20).fill(false)); // For top 20 songs selections
  const [clickState, setClickState] = useState(new Array(20).fill(false)); // For recommendation cell selections

  const navigate = useNavigate();

  const [select, setSelect] = useState({
    seed_artists: null,
    seed_genres: null,
    target_loudness: null,
    target_popularity: null,
    target_tempo: null,
    target_key: null,
    target_time_signature: null,
  });

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

  const handleGetArtist = async (id) => {
    await axios
      .get(GET_ARTIST_ENDPOINT + id, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setArtist((prevState) => [...prevState, response.data]);
        console.log("artist: " + artist);
        console.log(artist);
      })
      .catch((error) => {
        console.log("Get artist error - " + error);
      });
  };

  const handleGetTrack = async (id) => {
    await axios
      .get(GET_TRACK_ENDPOINT + id, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTrack((prevState) => [...prevState, response.data]);
        console.log("track: " + track);
        console.log(track);
      })
      .catch((error) => {
        console.log("Get track error - " + error);
      });
  };

  const handleAudioAnalysis = async (id) => {
    await axios
      .get(AUDIO_ANALYSIS_ENDPOINT + id, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setAudioAnalysis((prevState) => [...prevState, response.data]);
      })
      .catch((error) => {
        console.log("Get audio analysis error - " + error);
      });
  };

  const handleRecommendation = () => {
    // console.log(select.genres);
    axios
      .get(RECOMMENDATION_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        params: {
          limit: 10,
          seed_artists: select.seed_artists,
          seed_genres: select.seed_genres,
          target_loudness: select.target_loudness,
          target_popularity: select.target_popularity,
          target_tempo: select.target_tempo,
          target_key: select.target_key,
          target_time_signature: select.target_time_signature,
        },
      })
      .then((response) => {
        setRecommendations(response);
      })
      .catch((error) => {
        console.log("Get recommendation error - " + error);
      });
    console.log(recommendations);
  };

  const clickCell = (position) => {
    if (document.getElementById(position).innerText === "") {
      return null;
    }
    if (
      (position % 2 === 0 && !clickState[position + 1]) ||
      (position % 2 !== 0 && !clickState[position - 1])
    ) {
      const updatedClickState = clickState.map((state, index) =>
        index === position ? !state : state
      );
      setClickState(updatedClickState);
    } else if (position % 2 === 0 && clickState[position + 1]) {
      const updatedClickState = clickState.map((state, index) =>
        index === position || index === position + 1 ? !state : state
      );
      setClickState(updatedClickState);
    } else {
      const updatedClickState = clickState.map((state, index) =>
        index === position || index === position - 1 ? !state : state
      );
      setClickState(updatedClickState);
    }

    const cell = cellNum[position];
    if (!clickState[position]) {
      setSelect((prevState) => ({
        ...prevState,
        [cell]: document
          .getElementById(position)
          .innerHTML.replaceAll("<p>", "")
          .replaceAll("</p>", ","),
      }));
    } else {
      setSelect((prevState) => ({
        ...prevState,
        [cell]: null,
      }));
    }

    // console.log(clickState);
    // console.log(select);
  };

  // submit selected songs
  const handleSubmit = async (event) => {
    await compareArtist.map((compare) => handleGetArtist(compare));
    await compareTrack.map((compare) => handleGetTrack(compare));
    await compareTrack.map((compare) => handleAudioAnalysis(compare));
    console.log(track);
    setCompareArtist([]);
    setCompareTrack([]);
    setArtist([]);
    setTrack([]);
    setAudioAnalysis([]);
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

          <button type="submit" to="/compare">
            <Link to="/compare" state={{ track: { track } }}>
              submit
            </Link>
          </button>
          {/* <input type="submit" value="Submit" /> */}
        </form>
      </div>
      <div className="App">
        <table>
          <tr>
            <th>#</th>
            <th>Song 1</th>
            <th>Song 2</th>
          </tr>
          <tr>
            <td>Song name</td>
            <td>{track[0]?.name ? track[0].name : null}</td>
            <td>{track[1]?.name ? track[1].name : null}</td>
          </tr>
          <tr>
            <td>Artists</td>
            <td
              onClick={() => clickCell(0)}
              style={{ backgroundColor: clickState[0] ? "salmon" : "" }}
              id="0"
            >
              {artist[0]?.name ? artist[0].name : null}
            </td>
            <td
              onClick={() => clickCell(1)}
              style={{ backgroundColor: clickState[1] ? "salmon" : "" }}
              id="1"
            >
              {artist[1]?.name ? artist[1].name : null}
            </td>
          </tr>
          <tr>
            <td>Genres</td>
            <td
              onClick={() => clickCell(2)}
              style={{ backgroundColor: clickState[2] ? "salmon" : "" }}
              id="2"
            >
              {artist[0]?.genres
                ? artist[0].genres.map((a) => <p>{a}</p>)
                : null}
            </td>
            <td
              onClick={() => clickCell(3)}
              style={{ backgroundColor: clickState[3] ? "salmon" : "" }}
              id="3"
            >
              {artist[1]?.genres
                ? artist[1].genres.map((a) => <p>{a}</p>)
                : null}
            </td>
          </tr>
          <tr>
            <td>Loudness</td>
            <td
              onClick={() => clickCell(4)}
              style={{ backgroundColor: clickState[4] ? "salmon" : "" }}
              id="4"
            >
              {audioAnalysis[0]?.track ? audioAnalysis[0].track.loudness : null}
            </td>
            <td
              onClick={() => clickCell(5)}
              style={{ backgroundColor: clickState[5] ? "salmon" : "" }}
              id="5"
            >
              {audioAnalysis[1]?.track ? audioAnalysis[1].track.loudness : null}
            </td>
          </tr>
          <tr>
            <td>Popularity</td>
            <td
              onClick={() => clickCell(6)}
              style={{ backgroundColor: clickState[6] ? "salmon" : "" }}
              id="6"
            >
              {track[0]?.popularity ? track[0].popularity : null}
            </td>
            <td
              onClick={() => clickCell(7)}
              style={{ backgroundColor: clickState[7] ? "salmon" : "" }}
              id="7"
            >
              {track[1]?.popularity ? track[1].popularity : null}
            </td>
          </tr>
          <tr>
            <td>Tempo</td>
            <td
              onClick={() => clickCell(8)}
              style={{ backgroundColor: clickState[8] ? "salmon" : "" }}
              id="8"
            >
              {audioAnalysis[0]?.track ? audioAnalysis[0].track.tempo : null}
            </td>
            <td
              onClick={() => clickCell(9)}
              style={{ backgroundColor: clickState[9] ? "salmon" : "" }}
              id="9"
            >
              {audioAnalysis[1]?.track ? audioAnalysis[1].track.tempo : null}
            </td>
          </tr>
          <tr>
            <td>Key</td>
            <td
              onClick={() => clickCell(10)}
              style={{ backgroundColor: clickState[10] ? "salmon" : "" }}
              id="10"
            >
              {audioAnalysis[0]?.track ? audioAnalysis[0].track.key : null}
            </td>
            <td
              onClick={() => clickCell(11)}
              style={{ backgroundColor: clickState[11] ? "salmon" : "" }}
              id="11"
            >
              {audioAnalysis[1]?.track ? audioAnalysis[1].track.key : null}
            </td>
          </tr>
          <tr>
            <td>Time signature</td>
            <td
              onClick={() => clickCell(12)}
              style={{ backgroundColor: clickState[12] ? "salmon" : "" }}
              id="12"
            >
              {audioAnalysis[0]?.track
                ? audioAnalysis[0].track.time_signature
                : null}
            </td>
            <td
              onClick={() => clickCell(13)}
              style={{ backgroundColor: clickState[13] ? "salmon" : "" }}
              id="13"
            >
              {audioAnalysis[1]?.track
                ? audioAnalysis[1].track.time_signature
                : null}
            </td>
          </tr>
        </table>

        <button onClick={handleRecommendation}>Get Recommendations</button>
      </div>
    </div>
  );
};
export default Main;

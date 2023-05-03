import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useLocation, Link } from "react-router-dom";
import { validGenres } from "./ValidGenres.js";

const GET_ARTIST_ENDPOINT = "https://api.spotify.com/v1/artists/";
const GET_TRACK_ENDPOINT = "https://api.spotify.com/v1/tracks/";
const AUDIO_ANALYSIS_ENDPOINT = "https://api.spotify.com/v1/audio-analysis/";
// const token = localStorage.getItem("accessToken");

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
  14: "seed_tracks",
  15: "seed_tracks",
};

const Compare = () => {
  //   const [search] = useSearchParams();
  const [token, setToken] = useState("");
  const location = useLocation();
  const [artist, setArtist] = useState([]);
  const [track, setTrack] = useState([]);
  const [audioAnalysis, setAudioAnalysis] = useState([]);
  const [compareArtist, setCompareArtist] = useState([]);
  const [compareTrack, setCompareTrack] = useState([]);
  const [done, setDone] = useState(false);
  const selectedColor = "#d1dbd5";

  const [clickState, setClickState] = useState(new Array(20).fill(false)); // For recommendation cell selections
  const [select, setSelect] = useState({
    seed_artists: null,
    seed_genres: null,
    target_loudness: null,
    target_popularity: null,
    target_tempo: null,
    target_key: null,
    target_time_signature: null,
    seed_tracks: null,
  });

  useEffect(() => {
    setDone(false);
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
    }
    setCompareArtist(location.state.compare.compareArtist);
    setCompareTrack(location.state.compare.compareTrack);
    submitCompare();
    setDone(true);
  }, [compareArtist, compareTrack, done]);

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

  const submitCompare = () => {
    compareArtist.map((compare) => handleGetArtist(compare));
    compareTrack.map((compare) => handleGetTrack(compare));
    compareTrack.map((compare) => handleAudioAnalysis(compare));
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

    const checkValid = (genres) => {
      let genreList = [];
      let checkedGenres = [];
      genreList = genres.split(",");
      {
        genreList.map((genre) => {
          if (validGenres.indexOf(genre) > -1) {
            console.log("return");
            checkedGenres = [1];
            return genres;
          }
        });
      }
      if (checkedGenres.length === 0) {
        genreList = genres.replaceAll(",", " ").split(" ");
        {
          genreList.map((genre) => {
            if (validGenres.indexOf(genre) > -1) {
              checkedGenres.push(genre);
              console.log(checkedGenres);
            }
          });
        }
        if (checkedGenres.length > 3) {
          return checkedGenres.slice(0, 3);
        }
        return checkedGenres;
      }
      return genres;
    };

    const cell = cellNum[position];
    if (!clickState[position]) {
      if (cell === "seed_artists") {
        setSelect((prevState) => ({
          ...prevState,
          [cell]: artist[position].id,
        }));
      } else if (position === 14 || position === 15) {
        setSelect((prevState) => ({
          ...prevState,
          [cell]: track[position - 14].id,
        }));
      } else if (cell === "seed_genres") {
        let genre = document
          .getElementById(position)
          .innerHTML.replaceAll("<p>", "")
          .replaceAll("</p>", ",");
        genre = checkValid(genre).toString();
        setSelect((prevState) => ({
          ...prevState,
          [cell]: genre,
        }));
      } else {
        setSelect((prevState) => ({
          ...prevState,
          [cell]: document
            .getElementById(position)
            .innerHTML.replaceAll("<p>", "")
            .replaceAll("</p>", ","),
        }));
      }
    } else {
      setSelect((prevState) => ({
        ...prevState,
        [cell]: null,
      }));
    }

    // console.log(clickState);
    // console.log(select);
  };

  const handleRecommendation = (e) => {
    if (clickState.every((current) => current === false)) {
      alert("Please select at least one element");
      e.preventDefault();
    } else {
      console.log(select);
      setArtist([]);
      setTrack([]);
      setAudioAnalysis([]);
      setClickState(new Array(20).fill(false));
    }
  };

  return (
    <div>
      {done ? (
        <div className="Compare">
          <table>
            <tr>
              <th>#</th>
              <th>Element description</th>
              <th>Song 1</th>
              <th>Song 2</th>
            </tr>
            <tr>
              <td>Song name</td>
              <td>#</td>
              <td
                onClick={() => clickCell(14)}
                style={{ backgroundColor: clickState[14] ? selectedColor : "" }}
                id="14"
              >
                {track[0]?.name ? track[0].name : null}
              </td>
              <td
                onClick={() => clickCell(15)}
                style={{ backgroundColor: clickState[15] ? selectedColor : "" }}
                id="15"
              >
                {track[1]?.name ? track[1].name : null}
              </td>
            </tr>
            <tr>
              <td>Artists</td>
              <td></td>
              <td
                onClick={() => clickCell(0)}
                style={{ backgroundColor: clickState[0] ? selectedColor : "" }}
                id="0"
              >
                {artist[0]?.name ? artist[0].name : null}
              </td>
              <td
                onClick={() => clickCell(1)}
                style={{ backgroundColor: clickState[1] ? selectedColor : "" }}
                id="1"
              >
                {artist[1]?.name ? artist[1].name : null}
              </td>
            </tr>
            <tr>
              <td>Genres</td>
              <td></td>
              <td
                onClick={() => clickCell(2)}
                style={{ backgroundColor: clickState[2] ? selectedColor : "" }}
                id="2"
              >
                {artist[0]?.genres
                  ? artist[0].genres.map((a) => <p>{a}</p>)
                  : null}
              </td>
              <td
                onClick={() => clickCell(3)}
                style={{ backgroundColor: clickState[3] ? selectedColor : "" }}
                id="3"
              >
                {artist[1]?.genres
                  ? artist[1].genres.map((a) => <p>{a}</p>)
                  : null}
              </td>
            </tr>
            <tr>
              <td>Loudness</td>
              <td></td>
              <td
                onClick={() => clickCell(4)}
                style={{ backgroundColor: clickState[4] ? selectedColor : "" }}
                id="4"
              >
                {audioAnalysis[0]?.track
                  ? audioAnalysis[0].track.loudness
                  : null}
              </td>
              <td
                onClick={() => clickCell(5)}
                style={{ backgroundColor: clickState[5] ? selectedColor : "" }}
                id="5"
              >
                {audioAnalysis[1]?.track
                  ? audioAnalysis[1].track.loudness
                  : null}
              </td>
            </tr>
            <tr>
              <td>Popularity</td>
              <td></td>
              <td
                onClick={() => clickCell(6)}
                style={{ backgroundColor: clickState[6] ? selectedColor : "" }}
                id="6"
              >
                {track[0]?.popularity ? track[0].popularity : null}
              </td>
              <td
                onClick={() => clickCell(7)}
                style={{ backgroundColor: clickState[7] ? selectedColor : "" }}
                id="7"
              >
                {track[1]?.popularity ? track[1].popularity : null}
              </td>
            </tr>
            <tr>
              <td>Tempo</td>
              <td></td>
              <td
                onClick={() => clickCell(8)}
                style={{ backgroundColor: clickState[8] ? selectedColor : "" }}
                id="8"
              >
                {audioAnalysis[0]?.track ? audioAnalysis[0].track.tempo : null}
              </td>
              <td
                onClick={() => clickCell(9)}
                style={{ backgroundColor: clickState[9] ? selectedColor : "" }}
                id="9"
              >
                {audioAnalysis[1]?.track ? audioAnalysis[1].track.tempo : null}
              </td>
            </tr>
            <tr>
              <td>Key</td>
              <td></td>
              <td
                onClick={() => clickCell(10)}
                style={{ backgroundColor: clickState[10] ? selectedColor : "" }}
                id="10"
              >
                {audioAnalysis[0]?.track ? audioAnalysis[0].track.key : null}
              </td>
              <td
                onClick={() => clickCell(11)}
                style={{ backgroundColor: clickState[11] ? selectedColor : "" }}
                id="11"
              >
                {audioAnalysis[1]?.track ? audioAnalysis[1].track.key : null}
              </td>
            </tr>
            <tr>
              <td>Time signature</td>
              <td></td>
              <td
                onClick={() => clickCell(12)}
                style={{ backgroundColor: clickState[12] ? selectedColor : "" }}
                id="12"
              >
                {audioAnalysis[0]?.track
                  ? audioAnalysis[0].track.time_signature
                  : null}
              </td>
              <td
                onClick={() => clickCell(13)}
                style={{ backgroundColor: clickState[13] ? selectedColor : "" }}
                id="13"
              >
                {audioAnalysis[1]?.track
                  ? audioAnalysis[1].track.time_signature
                  : null}
              </td>
            </tr>
          </table>
          <div className="inLine">
            <button onClick={handleRecommendation} style={{ width: "200px" }}>
              {clickState.every((current) => current === false) ? (
                "Get Recommendations"
              ) : (
                <Link
                  to="/recommendation"
                  state={{ recommendation: { select } }}
                >
                  Get Recommendations
                </Link>
              )}
            </button>
            <button
              style={{
                width: "100px",
                height: "50px",
                marginLeft: "auto",
                marginRight: 0,
              }}
            >
              <a href="/main">Back</a>
            </button>
          </div>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};
export default Compare;

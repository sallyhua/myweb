import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useLocation, Link } from "react-router-dom";

const GET_ARTIST_ENDPOINT = "https://api.spotify.com/v1/artists/";
const GET_TRACK_ENDPOINT = "https://api.spotify.com/v1/tracks/";
const AUDIO_ANALYSIS_ENDPOINT = "https://api.spotify.com/v1/audio-analysis/";
const token = localStorage.getItem("accessToken");

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

const Compare = () => {
  //   const [search] = useSearchParams();
  const location = useLocation();
  const [artist, setArtist] = useState([]);
  const [track, setTrack] = useState([]);
  const [audioAnalysis, setAudioAnalysis] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [compareArtist, setCompareArtist] = useState([]);
  const [compareTrack, setCompareTrack] = useState([]);

  const [clickState, setClickState] = useState(new Array(20).fill(false)); // For recommendation cell selections
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
    setCompareArtist(location.state.compare.compareArtist);
    setCompareTrack(location.state.compare.compareTrack);
    submitCompare();
  }, [compareArtist, compareTrack]);

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

    const cell = cellNum[position];
    if (!clickState[position]) {
      if (position === 0 || position === 1) {
        setSelect((prevState) => ({
          ...prevState,
          [cell]: artist[position].id,
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

  const handleRecommendation = () => {
    console.log(select);
    // axios
    //   .get(RECOMMENDATION_ENDPOINT, {
    //     headers: {
    //       Authorization: "Bearer " + token,
    //       "Content-Type": "application/json",
    //     },
    //     params: {
    //       limit: 10,
    //       seed_artists: null,
    //       seed_genres: select.seed_genres,
    //       target_loudness: select.target_loudness,
    //       target_popularity: select.target_popularity,
    //       target_tempo: select.target_tempo,
    //       target_key: select.target_key,
    //       target_time_signature: select.target_time_signature,
    //     },
    //   })
    //   .then((response) => {
    //     setRecommendations(response);
    //   })
    //   .catch((error) => {
    //     console.log("Get recommendation error - " + error);
    //   });
    // console.log(recommendations);
    setArtist([]);
    setTrack([]);
    setAudioAnalysis([]);
    setClickState(new Array(20).fill(false));
  };

  return (
    <div>
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

        <button onClick={handleRecommendation}>
          <Link to="/recommendation" state={{ recommendation: { select } }}>
            Get Recommendations
          </Link>
        </button>
      </div>
    </div>
  );
};
export default Compare;

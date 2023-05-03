import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import play from "../icons/playIcon.png";

const RECOMMENDATION_ENDPOINT = "https://api.spotify.com/v1/recommendations?";
// const token = localStorage.getItem("accessToken");

const Recommendation = () => {
  const [token, setToken] = useState("");
  const location = useLocation();
  const [recommendations, setRecommendations] = useState({});
  const [select, setSelect] = useState({});
  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
    }
    setSelect(location.state.recommendation.select);
    handleRecommendation();
  }, [select]);

  const handleRecommendation = () => {
    console.log(select);
    axios
      .get(RECOMMENDATION_ENDPOINT, {
        headers: {
          Authorization: "Bearer  " + token,
          "Content-Type": "application/json",
        },
        params: {
          seed_tracks: select.seed_tracks,
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
        console.log(error.message);
      });

    console.log(recommendations);
  };

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        minHeight: "100%",
        paddingLeft: "20px",
        paddingBottom: "50px",
        backgroundColor: "#d1dbd5",
      }}
    >
      <div className="inLine">
        <h1
          style={{
            color: "#034343",
          }}
        >
          Recommendations
        </h1>
        <button onClick={handleRecommendation} style={{ width: "200px" }}>
          Get Recommendations
        </button>
      </div>
      {recommendations?.data ? (
        <div className="Recommendation">
          {recommendations.data.tracks.map((track, index) => (
            <div className="MusicContainer">
              <div>
                <img
                  src={track.album.images[0].url}
                  alt="cover"
                  width="230px"
                  height="180px"
                />
                {/* {console.log(top.album.artists[0].name)} */}
                <div className="Music">
                  <p>
                    {track.album.artists[0].name}
                    <br />
                    {track.name}
                  </p>
                  <Link to={track.external_urls.spotify} target="_blank">
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
      <div className="inline">
        <button
          style={{ width: "100px", height: "50px", marginTop: "30px" }}
          onClick={handleRecommendation}
        >
          Again
        </button>
        <button style={{ width: "100px", height: "50px", marginLeft: "5%" }}>
          <a href="/main">Back</a>
        </button>
      </div>
    </div>
  );
};
export default Recommendation;

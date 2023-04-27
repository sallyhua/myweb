import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const RECOMMENDATION_ENDPOINT = "https://api.spotify.com/v1/recommendations";
// const token = localStorage.getItem("accessToken");

const Recommendation = () => {
  const [token, setToken] = useState("");
  const location = useLocation();
  const [recommendations, setRecommendations] = useState({});
  const [select, setSelect] = useState({});
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setSelect(location.state.recommendation.select);
    handleRecommendation();
  }, [select]);

  const handleRecommendation = () => {
    console.log("select");
    console.log(select);
    axios
      .get(RECOMMENDATION_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        params: {
          limit: 10,
          seed_artists: null,
          seed_genres: select.seed_genres,
          target_loudness: null,
          target_popularity: null,
          target_tempo: null,
          target_key: null,
          target_time_signature: null,
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

  return (
    <div>
      <p>recommendation</p>
      {/* <p>{recommendations.data.tracks[0].name}</p> */}
      <button onClick={handleRecommendation} />
    </div>
  );
};
export default Recommendation;

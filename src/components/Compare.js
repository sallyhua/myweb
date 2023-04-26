import React from "react";
import "../App.css";
import { useSearchParams, useLocation } from "react-router-dom";

const Compare = () => {
  //   const [search] = useSearchParams();
  const location = useLocation();
  return (
    <div>
      <p>compare</p>
      <p>{console.log(location.state.track.track[0])}</p>
    </div>
  );
};
export default Compare;

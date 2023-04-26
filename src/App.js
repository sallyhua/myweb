import "./App.css";
import React from "react";
import WebApp from "./components/WebApp";
import Main from "./components/Main";
import Compare from "./components/Compare";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WebApp />} />
        <Route path="/main" element={<Main />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </Router>
  );
};

export default App;

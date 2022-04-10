import React from "react";
import ReactDOM from "react-dom";
import App from './App';
import "./index.css";
// import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

//       <Route path="/Movies" element={<Movie />} />
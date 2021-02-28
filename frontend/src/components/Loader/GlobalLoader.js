import React from "react";
import Loader from "./Loader";

function GlobalLoader(props) {
  return (
    <div className="globalLoader">
      <div className="loaderBackground"></div>
      <div className="loader">
        <Loader />
      </div>
    </div>
  );
}

export default GlobalLoader;

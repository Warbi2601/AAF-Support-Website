import React from "react";
import Lottie from "react-lottie";
import animationData from "../animations/Loader.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Loader({ height = 200, width = 200 }) {
  return (
    <div>
      <Lottie options={defaultOptions} height={height} width={width} />
    </div>
  );
}

export default Loader;

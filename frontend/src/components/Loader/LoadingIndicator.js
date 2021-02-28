import React from "react";
import { usePromiseTracker } from "react-promise-tracker";

import GlobalLoader from "../Loader/GlobalLoader";

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker({
    delay: 500,
    area: props.area,
  });
  return promiseInProgress && <GlobalLoader />;
};

export default LoadingIndicator;

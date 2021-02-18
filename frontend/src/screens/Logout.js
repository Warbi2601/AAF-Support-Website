import React, { useEffect } from "react";
import axios from "axios";
import settings from "../settings/settings";
import { useHistory } from "react-router-dom";

function Logout(props) {
  const history = useHistory();

  useEffect(() => {
    axios
      .get(settings.authUrl + "/logout")
      .then((res) => history.push("/check-auth"));
  }, []);

  return <div>Logging out...</div>;
}

export default Logout;

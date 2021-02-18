import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import settings from "../settings/settings";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    static contextType = UserContext;

    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }

    componentDidMount() {
      axios
        .get(settings.authUrl + "/checkToken")
        .then((res) => {
          if (res.status === 200) {
            //if theres no saved user state but our token is valid, then set it
            if (!this.context.user) this.context.setUser(res.data);
            this.setState({ loading: false });
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch((err) => {
          if (err?.response.status === 401) {
            if (this.context.user) this.context.setUser(null);
          }

          console.error("error checking token", err);
          this.setState({ loading: false, redirect: true });
        });
    }

    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }

      return <ComponentToProtect {...this.props} />;
    }
  };
}

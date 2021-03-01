import axios from "axios";
import React, { Component } from "react";
import { UserContext } from "../context/UserContext";
import settings from "../settings/settings";

export default class Home extends Component {
  static contextType = UserContext;

  constructor() {
    super();
    this.state = {
      message: "",
    };
  }

  //Hook
  componentDidMount() {
    axios
      .get(settings.apiUrl + "/home/home")
      .then((res) => res.data)
      .then((res) => this.setState({ message: res }));
  }

  render() {
    const user = this.context.user;
    const userName = user ? `${user?.firstName} ${user?.lastName}` : "";

    return (
      <div>
        <h1>Home</h1>
        <p>
          {this.state.message
            ? `${this.state.message} ${userName}`
            : "...Loading"}
        </p>
      </div>
    );
  }
}

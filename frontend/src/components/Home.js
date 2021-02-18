import axios from "axios";
import React, { Component } from "react";
import settings from "../settings/settings";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      message: "Loading...",
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
    return (
      <div>
        <h1>Home</h1>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

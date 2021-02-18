import React, { Component } from "react";
import settings from "../settings/settings";
import axios from "axios";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      message: "Secret Loading...",
    };
  }

  //Hook
  componentDidMount() {
    axios
      .get(settings.apiUrl + "/home/secret")
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

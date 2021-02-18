import axios from "axios";
import React, { Component } from "react";
import moment from "moment";
import { UserContext } from "../context/UserContext";
import settings from "../settings/settings";

export default class TicketDetails extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      ticket: {},
      loading: true,
      error: null,
    };
  }

  render() {
    let data = this.state.ticket || {};
    return !this.state.loading ? (
      <div>
        <p>Welcome to your ticket mr {this.context.user?.email}</p>
        <p>Issue: {data.issue}</p>
        <p>Date Logged: {moment(data.dateLogged).format("DD/MM/YYYY")}</p>
        <p>Logged By: {data.loggedBy?.email}</p>
        <p>Logged For: {data.loggedFor?.email}</p>
        <p>Department: {data.department}</p>
        <p>Assigned To: {data.assignedTo?.email}</p>
      </div>
    ) : (
      <div>
        <p>Ticket Loading...</p>
      </div>
    );
  }

  componentDidMount() {
    axios
      .get(settings.apiUrl + "/tickets/" + this.props.match.params.id)
      .then((res) => {
        this.setState({
          loading: false,
          ticket: res.data,
        });
      });
  }
}

import axios from "axios";
import React, { Component } from "react";
import moment from "moment";
import { UserContext } from "../context/UserContext";
import settings from "../settings/settings";
import utility from "../utility/utility";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "../components/Loader/LoadingIndicator";
import { toast } from "react-toastify";

export default class TicketDetails extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      ticket: {},
    };
  }

  getTicket = () => {
    trackPromise(
      axios
        .get(settings.apiUrl + "/tickets/" + this.props.match.params.id)
        .then((res) => {
          this.setState({
            ticket: res.data,
          });
        }),
      "ticket-details-area"
    );
  };

  updateTicket = (successMessage) => {
    trackPromise(
      axios
        .put(settings.apiUrl + "/tickets", this.state.ticket)
        .then(() => {
          this.getTicket();
          toast.success(successMessage);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.error);
        }),
      "ticket-details-area"
    );
  };

  reopenTicket = () => {
    //render an are you sure modal
    this.updateTicket("Ticket Reopened");
  };

  addMoreInfo = () => {
    // render modal with just issue textarea and update that field
    this.updateTicket("Information Added");
  };

  closeTicket = () => {
    //render an are you sure modal
    this.updateTicket("Ticket Closed");
  };

  cancelTicketByUser = () => {
    //render an are you sure modal
    this.updateTicket("Ticket Cancelled");
  };

  render() {
    let data = this.state.ticket || {};
    const user = this.context.user;
    return (
      <div>
        <p>Welcome to your ticket mr {user?.email}</p>
        <p>Issue: {data.issue}</p>
        <p>Date Logged: {moment(data.dateLogged).format("DD/MM/YYYY")}</p>
        <p>Logged By: {data.loggedBy?.email}</p>
        <p>Logged For: {data.loggedFor?.email}</p>
        <p>Department: {data.department}</p>
        <p>Assigned To: {data.assignedTo?.email}</p>
        <p>Status: {utility.statusToString(data.status)}</p>
        {utility.getActionsForRole(user?.role).actions.map((action) => (
          <button key={action.order} className="btn-default">
            {action.name}
          </button>
        ))}
        <LoadingIndicator area="ticket-details-area" />
      </div>
    );
  }

  componentDidMount() {
    this.getTicket();
  }
}

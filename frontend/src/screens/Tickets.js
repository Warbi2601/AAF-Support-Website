import axios from "axios";
import React, { Component } from "react";
import moment from "moment";
import settings from "../settings/settings";
import Table from "../components/Table";
import utility from "../utility/utility";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import CreateTicket from "./CreateTicket";
import formatting from "../utility/formatting";
import { UserContext } from "../context/UserContext";
import TicketSearch from "../components/TicketSearch";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const columns = [
  {
    name: "Issue",
    selector: (row) => row.issue,
    sortable: true,
  },
  {
    name: "Date Logged",
    selector: (row) => moment(row.dateLogged).format(formatting.dateTimeFormat),
    sortable: true,
  },
  {
    name: "Logged By",
    selector: (row) => row.loggedBy.email,
    sortable: true,
  },
  {
    name: "Logged For",
    selector: (row) => row.loggedFor,
    sortable: true,
    cell: (row) => (
      <div>{row.loggedFor?.email || <span className="error">N/A</span>}</div>
    ),
  },
  {
    name: "Department",
    selector: (row) => row.department,
    sortable: true,
  },
  {
    name: "Assigned To",
    selector: (row) => row.assignedTo,
    sortable: true,
    cell: (row) => (
      <div>{row.assignedTo?.email || <span className="error">N/A</span>}</div>
    ),
  },
  {
    name: "Status",
    selector: (row) =>
      utility.getLatestTicketStatusByDate(row.statusHistory).currentStatus,
    sortable: true,
  },
  {
    name: "Awaiting Live Chat?",
    selector: (row) =>
      row.chatHistory.some((x) => x.active === true) ? (
        <CheckCircleIcon htmlColor="green" />
      ) : (
        <HighlightOffIcon htmlColor="red" />
      ),
    sortable: true,
  },
];

export default class Tickets extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      masterTickets: [],
      loading: true,
      modalOpen: false,
    };
  }

  showModal = () => {
    this.setState({ modalOpen: true });
  };

  hideModal = () => {
    this.setState({ modalOpen: false });
  };

  searchTickets = async (values) => {
    let entries = Object.entries(values);
    entries = entries.filter((entry) => entry[1]); // remove anything from the object to compare if its null
    let allPropsEmpty = true;

    // loop through the properties in the search and the ticket and make sure all properties match the search criteria
    const search = this.state.masterTickets.filter((ticket) =>
      entries.every((entry) => {
        const key = entry[0];
        let value = entry[1];
        let ticketValue = ticket[key];
        if (typeof ticketValue === "object" && ticketValue !== null) {
          //if its an object (in the case of user) then lets get its ID to compare
          ticketValue = ticketValue._id;
        }

        allPropsEmpty = false; // we know there is some value at this point
        if (key === "issue" || key === "department")
          return ticketValue.includes(value);
        return value === ticketValue;
      })
    );

    this.setState({
      tickets: allPropsEmpty ? this.state.masterTickets : search, // if all the props were empty then reset the search back to all tickets
    });
  };

  resetSearch = (resetForm) => {
    resetForm();
    this.setState({ tickets: this.state.masterTickets });
  };

  render() {
    if (!this.context.user) return null;
    let data = this.state.tickets || [];
    const forSelf = this.context.user.role === "client";
    const createTicketActionName = forSelf
      ? "Create Ticket"
      : "Create Ticket For User";
    return (
      <div>
        <TicketSearch
          onSubmit={this.searchTickets}
          onReset={this.resetSearch}
        />

        <button onClick={this.showModal} className="btn-default">
          {createTicketActionName}
        </button>

        <Modal
          title={createTicketActionName}
          BodyComponent={() => (
            <CreateTicket history={this.props.history} forSelf={forSelf} />
          )}
          onHide={this.hideModal}
          show={this.state.modalOpen}
          loaderName={"create-ticket-area"}
        />

        <br />
        <br />

        <Table
          title="Tickets"
          columns={columns}
          data={data}
          progressPending={this.state.loading}
          onRowClicked={(item) => {
            this.props.history.push("/ticket-details/" + item._id);
            console.log(item);
          }}
        />
      </div>
    );
  }

  componentDidMount() {
    axios
      .get(settings.apiUrl + "/tickets")
      .then((res) => {
        this.setState({
          masterTickets: res.data,
          tickets: res.data,
          loading: false,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  }
}

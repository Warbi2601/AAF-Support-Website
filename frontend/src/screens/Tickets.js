import axios from "axios";
import React, { Component } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CreateIcon from "@material-ui/icons/Create";
import { Card } from "react-bootstrap";

import settings from "../settings/settings";
import Table from "../components/Table";
import utility from "../utility/utility";
import Modal from "../components/Modal";
import CreateTicket from "./CreateTicket";
import formatting from "../utility/formatting";
import { UserContext } from "../context/UserContext";
import TicketSearch from "../components/TicketSearch";

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
    name: "Allocated To",
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
        <HighlightOffIcon className="error" />
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

        //make sure we string match without case sensitivity
        ticketValue = ticketValue?.toUpperCase();
        value = value?.toUpperCase();

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
        <Card>
          <Card.Header>
            <h3>Search Tickets</h3>
          </Card.Header>
          <Card.Body>
            {/* <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text> */}
            <TicketSearch
              onSubmit={this.searchTickets}
              onReset={this.resetSearch}
            />
          </Card.Body>
        </Card>

        <br />

        <Card>
          <Card.Header>
            <h3>Tickets</h3>
          </Card.Header>
          <Card.Body>
            {this.context.user.role !== "admin" && (
              <button
                onClick={this.showModal}
                className="btn-default cardHeaderBtn"
              >
                <CreateIcon />
                {createTicketActionName}
              </button>
            )}

            <br />

            <br />
            <br />

            <Table
              columns={columns}
              data={data}
              progressPending={this.state.loading}
              onRowClicked={(item) => {
                this.props.history.push("/ticket-details/" + item._id);
                console.log(item);
              }}
            />
          </Card.Body>
        </Card>

        <Modal
          title={createTicketActionName}
          BodyComponent={() => (
            <CreateTicket history={this.props.history} forSelf={forSelf} />
          )}
          onHide={this.hideModal}
          show={this.state.modalOpen}
          loaderName={"create-ticket-area"}
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

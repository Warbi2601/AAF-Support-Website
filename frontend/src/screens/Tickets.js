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
    selector: (row) => utility.statusToString(row.status),
    sortable: true,
  },
];

export default class Tickets extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
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

  render() {
    if (!this.context.user) return null;
    let data = this.state.tickets || [];
    const forSelf = this.context.user.role === "client";
    const createTicketActionName = forSelf
      ? "Create Ticket"
      : "Create Ticket For User";
    return (
      <div>
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

        {/* <Modal show={this.state.modalOpen} onHide={this.hideModal}>
          <Modal.Header>
            <Modal.Title>Hi</Modal.Title>
          </Modal.Header>
          <Modal.Body>The body</Modal.Body>
          <Modal.Footer>
            <button onClick={this.hideModal}>Cancel</button>
            <button>Save</button>
          </Modal.Footer>
        </Modal> */}

        <Table
          title="Tickets"
          columns={columns}
          data={data}
          onRowClicked={(item) => {
            this.props.history.push("/ticket-details/" + item._id);
            console.log(item);
          }}
        />
      </div>
    );
  }

  componentDidMount() {
    // const onDelete = (itemToDelete) => {
    //   console.log(itemToDelete._id);

    //   axios
    //     .delete(settings.apiUrl + "/animals/delete-animal/" + itemToDelete._id)
    //     .then((res) => {
    //       if (res.error) this.setState({ error: res.error });

    //       this.setState({
    //         tickets: this.state.tickets.filter(
    //           (item) => item.props._id !== itemToDelete._id
    //         ),
    //       });
    //     });
    // };

    axios
      .get(settings.apiUrl + "/tickets")
      .then((res) => {
        this.setState({ tickets: res.data, loading: false });
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  }
}

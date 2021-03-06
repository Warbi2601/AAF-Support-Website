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
import { confirmAlert } from "react-confirm-alert";

export default class AdminCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      modalOpen: false,
    };
  }

  columns = [
    {
      name: "Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Edit User",
      selector: (row) => (
        <button onClick={this.showModal} className="btn-default">
          Edit User
        </button>
      ),
      sortable: true,
    },
    {
      name: "Delete User",
      selector: (row) => (
        <button onClick={() => this.deleteUser(row)} className="btn-default">
          Delete
        </button>
      ),
      sortable: true,
      // cell: (row) => (
      //   <div>{row.loggedFor?.email || <span className="error">N/A</span>}</div>
      // ),
    },
  ];

  showModal = () => {
    this.setState({ modalOpen: true });
  };

  hideModal = () => {
    this.setState({ modalOpen: false });
  };

  deleteUser = (user) => {
    confirmAlert({
      title: "Delete User",
      message:
        "Are you sure you want to delete this user? All tickets related to this user will be moved to the state of cancelled.",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.deleteUserConfirm(user),
        },
        {
          label: "No",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  deleteUserConfirm = (user) => {
    console.log("DELETE USER", user);
    axios
      .delete(settings.apiUrl + "/users/" + user._id)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  render() {
    let data = this.state.users || [];
    return (
      <div>
        {/* <button onClick={this.showModal} className="btn-default">
          Promote User
        </button> */}

        <Modal
          title="Edit User"
          BodyComponent={() => <CreateTicket history={this.props.history} />}
          onHide={this.hideModal}
          show={this.state.modalOpen}
          loaderName={"edit-user-area"}
        />

        <br />
        <br />

        <Table
          title="Users"
          columns={this.columns}
          data={data}
          loading={this.state.loading}
          //   onRowClicked={(item) => {
          //     this.props.history.push("/ticket-details/" + item._id);
          //     console.log(item);
          //   }}
        />
      </div>
    );
  }

  componentDidMount() {
    axios
      .get(settings.apiUrl + "/users")
      .then((res) => {
        this.setState({ users: res.data, loading: false });
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  }
}

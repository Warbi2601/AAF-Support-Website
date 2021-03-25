import axios from "axios";
import React, { Component } from "react";
import moment from "moment";
import { Edit, Delete } from "@material-ui/icons";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

import settings from "../settings/settings";
import Table from "../components/Table";
import utility from "../utility/utility";
import Modal from "../components/Modal";
import CreateTicket from "./CreateTicket";
import formatting from "../utility/formatting";
import EditUser from "../components/EditUser";
import { Card } from "react-bootstrap";

export default class AdminCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      modalOpen: false,
      EditComponent: () => <EditUser />,
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
      name: "Role",
      selector: (row) => utility.capitalize(row.role),
      sortable: true,
    },
    {
      name: "Edit User",
      selector: (row) => (
        <button
          onClick={() => {
            this.setState({
              EditComponent: () => (
                <EditUser
                  user={row}
                  onComplete={() => {
                    this.hideModal();
                    this.getUsers();
                  }}
                />
              ),
            });
            this.showModal();
          }}
          className="btn-default btn-sm"
        >
          <Edit />
        </button>
      ),
      sortable: true,
    },
    {
      name: "Delete User",
      selector: (row) => (
        <button
          onClick={() => this.deleteUser(row)}
          className="btn-default btn-sm"
        >
          <Delete />
        </button>
      ),
      sortable: true,
    },
  ];

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    axios
      .get(settings.apiUrl + "/users")
      .then((res) => {
        this.setState({ users: res.data, loading: false });
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

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
        "Are you sure you want to delete this user? All tickets related to this user will be deleted.",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.deleteUserConfirm(user),
        },
        {
          label: "No",
        },
      ],
    });
  };

  deleteUserConfirm = (user) => {
    console.log("DELETE USER", user);
    axios
      .delete(settings.apiUrl + "/users/" + user._id)
      .then((res) => {
        toast.success(res.data.success);
        this.setState({
          users: this.state.users.filter((x) => x._id !== user._id),
        });
      })
      .catch((err) => console.log(err));
  };

  render() {
    let data = this.state.users || [];
    return (
      <div>
        <Modal
          title="Edit User"
          BodyComponent={this.state.EditComponent}
          onHide={this.hideModal}
          show={this.state.modalOpen}
          loaderName={"edit-user-area"}
        />

        <Card>
          <Card.Header>
            <h3>Users</h3>
          </Card.Header>
          <Card.Body>
            <Table
              // title="Users"
              columns={this.columns}
              data={data}
              progressPending={this.state.loading}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
}

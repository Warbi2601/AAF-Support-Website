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

const columns = [
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
    name: "Change Password",
    selector: (row) => <div>click me la</div>,
    sortable: true,
  },
  {
    name: "Promote User",
    selector: (row) => <div>click me la</div>,
    sortable: true,
  },
  {
    name: "Delete",
    selector: (row) => <div>click me la</div>,
    sortable: true,
    // cell: (row) => (
    //   <div>{row.loggedFor?.email || <span className="error">N/A</span>}</div>
    // ),
  },
];

export default class AdminCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
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
          columns={columns}
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

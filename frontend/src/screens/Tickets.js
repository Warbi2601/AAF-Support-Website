import axios from "axios";
import React, { Component } from "react";
import moment from "moment";
import settings from "../settings/settings";
import Table from "../components/Table";
import utility from "../utility/utility";

const columns = [
  {
    name: "Issue",
    selector: (row) => row.issue,
    sortable: true,
  },
  {
    name: "Date Logged",
    selector: (row) => moment(row.dateLogged).format("DD/MM/YYYY"),
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
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      loading: true,
      error: null,
    };
  }

  render() {
    let data = this.state.tickets || [];
    return (
      <div>
        <p>{this.state.error}</p>

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
    const onDelete = (itemToDelete) => {
      console.log(itemToDelete._id);

      axios
        .delete(settings.apiUrl + "/animals/delete-animal/" + itemToDelete._id)
        .then((res) => {
          if (res.error) this.setState({ error: res.error });

          this.setState({
            tickets: this.state.tickets.filter(
              (item) => item.props._id !== itemToDelete._id
            ),
          });
        });
    };

    axios.get(settings.apiUrl + "/tickets").then((res) => {
      if (res.error) this.setState({ error: res.error });
      this.setState({ tickets: res.data, loading: false });
    });
  }
}

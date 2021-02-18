import axios from "axios";
import React, { Component } from "react";
import settings from "../settings/settings";
import DataTable from "react-data-table-component";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import moment from "moment";

const columns = [
  {
    name: "Issue",
    selector: "issue",
    sortable: true,
  },
  {
    name: "Date Logged",
    selector: "dateLogged",
    sortable: true,
    cell: (row) => <div>{moment(row).format("DD/MM/YYYY")}</div>,
  },
  {
    name: "Logged By",
    selector: "loggedBy.email",
    sortable: true,
  },
  {
    name: "Logged For",
    selector: "loggedFor.email",
    sortable: true,
  },
  {
    name: "Department",
    selector: "department",
    sortable: true,
  },
  {
    name: "Assigned To",
    selector: "assignedTo.email",
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
    console.log("Tickets", data);
    return !this.state.loading ? (
      <>
        {/* <div
         style={{
           flexDirection: "column",
           alignItems: "center",
           justifyContent: "center",
         }}
       >
         <p>{this.state.error}</p>
         <h2>Animal List</h2>
         <Table striped bordered hover>
           <thead>
             <tr>
               <th>Name</th>
               <th>Species</th>
               <th>Breed</th>
               <th>Age</th>
               <th>Colour</th>
               <th>Delete</th>
             </tr>
           </thead>
           <tbody>{data}</tbody>
         </Table>
       </div> */}
        <p>{this.state.error}</p>

        <DataTable
          title="Tickets"
          columns={columns}
          data={data}
          pagination={true}
          sortIcon={<ArrowDownward />}
          progressPending={data.length < 1}
          onRowClicked={(item) => {
            this.props.history.push("/ticket-details/" + item._id);
            console.log(item);
          }}
        />
      </>
    ) : (
      <div>
        <p>Loading Tickets...</p>
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

import axios from "axios";
import React, { Component } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { trackPromise } from "react-promise-tracker";

import { confirmAlert } from "react-confirm-alert";

import { UserContext } from "../context/UserContext";
import settings from "../settings/settings";
import utility from "../utility/utility";
import formatting from "../utility/formatting";
import Table from "../components/Table";
import AddInformation from "./AddInformation";
import Modal from "../components/Modal";

export default class TicketDetails extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      ticket: {},
      addMoreInfoModalOpen: false,
      addInfoComponent: null,
    };
  }

  showModal = () => {
    this.setState({ addMoreInfoModalOpen: true });
  };

  hideModal = () => {
    this.setState({ addMoreInfoModalOpen: false });
  };

  confirmPopup = (onPressYes, title, message) => {
    confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: "Yes",
          onClick: onPressYes,
        },
        {
          label: "No",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  getTicket = () => {
    trackPromise(
      axios
        .get(settings.apiUrl + "/tickets/" + this.props.match.params.id)
        .then((res) => {
          this.setState({
            ticket: res.data,
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.error);
        })
    );
  };

  updateTicket = (ticket, action, successMessage) => {
    trackPromise(
      axios
        .put(`${settings.apiUrl}/tickets/${this.state.ticket._id}`, {
          ticket,
          action,
        })
        .then(() => {
          this.getTicket();
          toast.success(successMessage);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.error);
        })
    );
  };

  //#region Ticket Actions

  //#region Client Actions

  reopenTicket = (action) => {
    //render an are you sure modal
    this.confirmPopup(
      () => this.updateTicket(this.state.ticket, action, "Ticket Reopened"),
      "Reopen ticket",
      "Are you sure you want to reopen this ticket?"
    );
  };

  addMoreInfo = async (action) => {
    this.setState({
      addInfoComponent: (
        <AddInformation
          action={action}
          onSubmit={(values) =>
            this.addMoreInfoSubmit(values, "Information Added")
          }
        />
      ),
      addMoreInfoModalOpen: true,
    });
  };

  addMoreInfoSubmit = (values, successMsg) => {
    let ticket = Object.assign({}, this.state.ticket); // creating copy of state variable ticket
    ticket.moreInfo.push({ date: new Date(), details: values.moreInfo });
    this.hideModal();
    this.updateTicket(ticket, values.action, successMsg);
  };

  closeTicket = (action) => {
    //render an are you sure modal
    this.confirmPopup(
      () => this.updateTicket(this.state.ticket, action, "Ticket Closed"),
      "Close ticket",
      "Are you sure you want to close this ticket?"
    );
  };

  cancelTicketByUser = (action) => {
    //render an are you sure modal
    this.confirmPopup(
      () => this.updateTicket(this.state.ticket, action, "Ticket Cancelled"),
      "Cancel ticket",
      "Are you sure you want to cancel this ticket?"
    );
  };

  //#endregion

  //#region Support Actions

  allocateToSelf = (action) => {
    let ticket = Object.assign({}, this.state.ticket); // creating copy of state variable ticket
    ticket.assignedTo = this.context.user._id;

    this.confirmPopup(
      () => this.updateTicket(ticket, action, "Ticket Allocated"),
      "Allocate ticket to self",
      "Are you sure you want to allocate this ticket to yourself?"
    );
  };

  checkTicket = (action) => {
    //render an are you sure modal
    this.confirmPopup(
      () => this.updateTicket(this.state.ticket, action, "Ticket Checked"),
      "Check ticket",
      "Are you sure you want to mark this ticket as checked?"
    );
  };

  reallocateTicket = (action) => {
    //render a modal to select the support agent to allocate to
  };

  solveTicket = (action) => {
    //render an are you sure modal
    this.confirmPopup(
      () => this.updateTicket(this.state.ticket, action, "Ticket Solved"),
      "Solve ticket",
      "Are you sure you want to mark this ticket as solved?"
    );
  };

  suspendTicket = (action) => {
    //render an are you sure modal
    this.confirmPopup(
      () =>
        this.setState({
          addInfoComponent: (
            <AddInformation
              action={action}
              onSubmit={(values) => {
                this.addMoreInfoSubmit(values, "Ticket Suspended");
              }}
            />
          ),
          addMoreInfoModalOpen: true,
        }),
      "Suspend ticket",
      "Are you sure you want to mark this ticket as suspended? You will be required to input some information to say why it has been suspended."
    );
  };

  cancelTicketBySupport = (action) => {
    //render an are you sure modal
    this.confirmPopup(
      () => this.updateTicket(this.state.ticket, action, "Ticket Cancelled"),
      "Cancel ticket",
      "Are you sure you want to mark this ticket as cancelled?"
    );
  };

  cancelAbandonedTicket = (action) => {
    //render an are you sure modal
    this.confirmPopup(
      () =>
        this.updateTicket(
          this.state.ticket,
          action,
          "Abandoned Ticket Cancelled"
        ),
      "Cancel abandoned ticket",
      "Are you sure you want to mark this abandoned ticket as cancelled?"
    );
  };

  //#endregion

  //#region Admin

  allocateToSupport = (action) => {
    //render same reallocate modal
  };

  closeExpiredTicket = (action) => {
    //render an are you sure modal
    this.confirmPopup(
      () =>
        this.updateTicket(this.state.ticket, action, "Expired Ticket Closed"),
      "Close expired ticket",
      "Are you sure you want to close this expired ticket?"
    );
  };

  //#endregion

  //#endregion

  render() {
    let data = this.state.ticket || null;

    if (
      data && // 👈 null and undefined check
      Object.keys(data).length === 0 &&
      data.constructor === Object
    )
      return null;
    const user = this.context.user;
    const userName = user ? `${user?.firstName} ${user?.lastName}` : "";

    const allUserActions = this.context.user.permissions.actions;

    const lastStatus = utility.getLatestTicketStatusByDate(data.statusHistory);

    console.log("LAST STATUS", lastStatus);

    const availableActions = utility.getAvailableActionsForTicket(
      allUserActions,
      lastStatus
    );

    console.log("AVAILABLE ACTIONS FOR USER", availableActions);

    const columns = [
      {
        name: "Action",
        selector: (row) => row.actionName,
        sortable: true,
      },
      {
        name: "Date",
        selector: (row) => moment(row.date).format(formatting.dateTimeFormat),
        sortable: true,
      },
      {
        name: "User",
        selector: (row) => row.user.name,
        sortable: true,
      },
    ];

    return (
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-6" style={{ textAlign: "left" }}>
            <h3>Ticket Details</h3>
            <br />
            <p>Issue: {data.issue}</p>
            <p>
              Logged By:
              {` ${data.loggedBy?.firstName} ${data.loggedBy?.lastName} (${data.loggedBy?.email})`}
            </p>
            <p>
              Logged For:
              {data.loggedFor
                ? ` ${data.loggedFor.firstName} ${data.loggedFor.lastName} (${data.loggedFor.email})`
                : " N/A"}
            </p>
            <p>
              Date Logged:{" "}
              {moment(data.dateLogged).format(formatting.dateTimeFormat)}
            </p>
            <p>Department: {data.department}</p>
            <p>Allocated To: {data.assignedTo?.email}</p>

            {data.moreInfo.length > 0 && (
              <>
                <br />
                <h3>More Info</h3> <br />
                {data.moreInfo?.map((moreInfo) => (
                  <p>{`${moment(moreInfo.date).format(
                    formatting.dateTimeFormat
                  )} - ${moreInfo.details}`}</p>
                ))}
                <br />
              </>
            )}

            {availableActions &&
              availableActions.map((action) => (
                <button
                  onClick={() => {
                    let fn = this[action.fnString]; //get function from string
                    if (typeof fn === "function") fn(action.order); // belt and braces, check its definitely a function in case of future changes
                  }}
                  key={action.order}
                  className="btn-default"
                >
                  {action.name}
                </button>
              ))}
          </div>
          <div className="col-md-6">
            <h3>Current Status</h3>
            <p>Status: {lastStatus.currentStatus}</p>
            <br />
            <h3>Status History</h3>
            <br />

            {/* @todo add custom sorter for date */}
            <Table
              // title="Status History"
              columns={columns}
              data={data.statusHistory || []}
              key={"order"}
              // onRowClicked={(item) => {
              //   this.props.history.push("/ticket-details/" + item._id);
              //   console.log(item);
              // }}
            />
          </div>
        </div>
        {/* <LoadingIndicator area="ticket-details-area" /> */}
        <Modal
          title="Add More Information"
          BodyComponent={() => this.state.addInfoComponent}
          onHide={this.hideModal}
          show={this.state.addMoreInfoModalOpen}
          loaderName={"add-info-area"}
        />
      </div>
    );
  }

  componentDidMount() {
    this.getTicket();
  }
}

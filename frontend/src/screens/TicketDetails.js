import axios from "axios";
import React, { Component } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { trackPromise } from "react-promise-tracker";
import { Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";

import { UserContext } from "../context/UserContext";
import settings from "../settings/settings";
import utility from "../utility/utility";
import formatting from "../utility/formatting";
import Table from "../components/Table";
import AddInformation from "./AddInformation";
import Modal from "../components/Modal";
import ChatHistory from "../components/chat/ChatHistory";
// import { Button } from "bootstrap";
import FormButton from "../components/forms/FormButton";
import AllocateTicket from "../components/AllocateTicket";

export default class TicketDetails extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      ticket: {},
      loading: true,
      addMoreInfoModalOpen: false,
      chatHistoryModalOpen: false,
      allocateModalOpen: false,
      addInfoComponent: null,
      allocateComponent: null,
    };
  }

  showModal = () => {
    this.setState({ addMoreInfoModalOpen: true });
  };

  hideModal = () => {
    this.setState({ addMoreInfoModalOpen: false });
  };

  showChatHistoryModal = () => {
    this.setState({ chatHistoryModalOpen: true });
  };

  hideChatHistoryModal = () => {
    this.setState({ chatHistoryModalOpen: false });
  };

  showAllocateModal = () => {
    this.setState({ allocateModalOpen: true });
  };

  hideAllocateModal = () => {
    this.setState({ allocateModalOpen: false });
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
    if (this.state.loading === false) this.setState({ loading: true });
    trackPromise(
      axios
        .get(settings.apiUrl + "/tickets/" + this.props.match.params.id || 0)
        .then((res) => {
          this.setState({
            ticket: res.data,
            loading: false,
          });
        })
        .catch((err) => {
          this.setState({
            loading: false,
          });
          console.log(err);
          toast.error(err.response.data.error);
        })
    );
  };

  deleteTicket = () => {
    //render an are you sure modal
    this.confirmPopup(
      this.deleteTicketConfirm,
      "Delete ticket",
      "Are you sure you want to delete this ticket?"
    );
  };

  deleteTicketConfirm = () => {
    trackPromise(
      axios
        .delete(settings.apiUrl + "/tickets/" + this.props.match.params.id || 0)
        .then((res) => {
          this.props.history.push("/tickets");
          toast.success("Ticket Deleted");
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

  startLiveChat = () => {
    const ticket = this.state.ticket;
    const newChatID = Date.now();
    this.props.history.push(`/room/${newChatID}/${ticket._id}`);
  };

  joinLiveChat = (chat) => {
    const ticket = this.state.ticket;
    this.props.history.push(`/room/${chat.chatID}/${ticket._id}`);
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
    this.setState({
      allocateComponent: (
        <AllocateTicket
          action={action}
          currentAssignedToID={this.state.ticket.assignedTo._id}
          isReallocate={true}
          onSubmit={(values) =>
            this.reallocateSubmit(values, "Ticket Reallocated")
          }
        />
      ),
      allocateModalOpen: true,
    });
  };

  reallocateSubmit = (values, successMsg) => {
    let ticket = Object.assign({}, this.state.ticket); // creating mutable copy of state variable ticket

    //validation
    if (ticket.assignedTo === values.assignedTo) {
      toast.error("That support agent is already allocated to this ticket");
      return;
    }

    ticket.assignedTo = values.assignedTo;
    this.hideAllocateModal();
    this.updateTicket(ticket, values.action, successMsg);
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
    //render a modal to select the support agent to allocate to
    this.setState({
      allocateComponent: (
        <AllocateTicket
          action={action}
          onSubmit={(values) =>
            this.allocateToSupportSubmit(values, "Ticket Allocated")
          }
        />
      ),
      allocateModalOpen: true,
    });
  };

  allocateToSupportSubmit = (values, successMsg) => {
    let ticket = Object.assign({}, this.state.ticket); // creating mutable copy of state variable ticket

    //set
    ticket.assignedTo = values.assignedTo;

    //hide and update
    this.hideAllocateModal();
    this.updateTicket(ticket, values.action, successMsg);
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

    const emptyTicketObj =
      data && // null and undefined check
      Object.keys(data).length === 0 &&
      data.constructor === Object;

    if (emptyTicketObj)
      return !this.state.loading ? (
        <div>
          <h1>Ticket Could Not Be Found</h1>
        </div>
      ) : null;

    const user = this.context.user;
    const userName = user ? `${user?.firstName} ${user?.lastName}` : "";

    const allUserActions = this.context.user.permissions.actions;

    const lastStatus = utility.getLatestTicketStatusByDate(data.statusHistory);

    const availableActions = utility.getAvailableActionsForTicket(
      allUserActions,
      lastStatus
    );

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
            <hr />
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
                <h3>More Info</h3> <hr />
                <br />
                {data.moreInfo?.map((moreInfo) => (
                  <p>{`${moment(moreInfo.date).format(
                    formatting.dateTimeFormat
                  )} - ${moreInfo.details}`}</p>
                ))}
                <br />
              </>
            )}

            <h3>Ticket Actions</h3>
            <hr />
            <br />
            {/* ensure only support agents who are assigned to the ticket can amend it */}
            {(availableActions && user.role !== "support") ||
            (user.role === "support" &&
              (!data.assignedTo || data.assignedTo._id === user._id)) ? (
              availableActions.map((action) => {
                // check if there is an amount of time that needs to have passed before this action can be ran
                if (action.days) {
                  debugger;
                  let daysSince = moment().diff(lastStatus.date, "days");
                  if (daysSince <= action.days) return;
                }
                return (
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
                );
              })
            ) : (
              <h6>No Ticket Actions Available</h6>
            )}

            {/* if the ticket is complete let an admin delete it */}
            {lastStatus?.availableActions?.length === 0 &&
              user.role === "admin" && (
                <button onClick={this.deleteTicket} className="btn-default">
                  Delete Ticket
                </button>
              )}
          </div>
          <div className="col-md-6">
            <h3>Current Status</h3>
            <hr />
            <br />
            <p>Status: {lastStatus.currentStatus}</p>
            <br />
            <h3>Status History</h3>
            <hr />
            <br />

            {/* @todo add custom sorter for date */}
            <Table
              // title="Status History"
              columns={columns}
              data={data.statusHistory || []}
              key={"order"}
              progressPending={this.state.loading}
            />
            <br />

            <h3>Live Chat</h3>
            <hr />
            <br />

            <div className="row">
              <div className="col-md-6">
                <Button onClick={this.showChatHistoryModal}>
                  View Chat History
                </Button>
              </div>

              <div className="col-md-6">
                {/* if the user is a client let them start a new live chat */}
                {user.role === "client" && (
                  <Button onClick={this.startLiveChat}>
                    Start New Live Chat
                  </Button>
                )}

                {user.role === "support" &&
                  data.chatHistory?.some((x) => x.active === true) && (
                    // if the user is a support and there is an active live chat, let them join
                    <Button
                      onClick={() =>
                        this.joinLiveChat(
                          data.chatHistory?.find((x) => x.active === true)
                        )
                      }
                    >
                      Join Active Live Chat
                    </Button>
                  )}
              </div>
            </div>
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

        <Modal
          title="Allocate Ticket"
          BodyComponent={() => this.state.allocateComponent}
          onHide={this.hideAllocateModal}
          show={this.state.allocateModalOpen}
          loaderName={"allocate-area"}
        />

        <Modal
          title="Chat History"
          BodyComponent={() => <ChatHistory chatHistory={data.chatHistory} />}
          onHide={this.hideChatHistoryModal}
          show={this.state.chatHistoryModalOpen}
          loaderName={"add-info-area"}
          size="lg"
        />
      </div>
    );
  }

  componentDidMount() {
    this.getTicket();
  }
}

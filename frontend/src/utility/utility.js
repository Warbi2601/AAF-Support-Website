import axios from "axios";
import settings from "../settings/settings";

const statusToString = (statusID) => {
  switch (statusID) {
    case 0:
      return "Open";
    case 1:
      return "Closed";
    case 2:
      return "In Progress";
    case 3:
      return "Resolved";
    case 4:
      return "Suspended";
    case 5:
      return "Cancelled";
    case 6:
      return "Expired";
    default:
      return "";
  }
};

const getStatusFromString = (statusString) => {
  switch (statusString) {
    case "Open":
      return 0;
    case "Closed":
      return 1;
    case "In Progress":
      return 2;
    case "Resolved":
      return 3;
    case "Suspended":
      return 4;
    case "Cancelled":
      return 5;
    case "Expired":
      return 6;
  }
};

const statusNextAction = (statusID) => {
  switch (statusID) {
    case 0:
      return "Open";
    case 1:
      return "Closed";
    case 2:
      return "In Progress";
    case 3:
      return "Resolved";
    case 4:
      return "Suspended";
    case 5:
      return "Cancelled";
    case 6:
      return "Expired";
  }
};

const getActionsForRole = async (role) => {
  if (!role) return [];
  //axios call to get the actions for the role here
  try {
    return await axios.get(settings.apiUrl + "/rolePermissions");
  } catch (error) {
    console.log("Error getting permissions", error);
    return [];
  }
};

const getActionByIDAsync = async (id) => {
  if (!id) return {};
  const actions = await getAllActions();
  return actions
    .find((role) => role.actions.find((action) => action.order === id))
    .actions.find((action) => action.order === id);
};

const getActionByID = (actions, id) => {
  if (!id || !actions) return {};
  // return actions
  //   .find((role) => role.actions.find((action) => action.order === id))
  //   .actions.find((action) => action.order === id);
  return actions.find((action) => action.order === id);
};

const getAllActions = async () => {
  const actions = [
    {
      role: "client",
      actions: [
        {
          order: 1,
          name: "Open Ticket",
        },
        {
          order: 8,
          name: "Reopen Ticket",
          fnString: "reopenTicket",
        },
        {
          order: 10,
          name: "Add More Information",
          fnString: "addMoreInfo",
        },
        {
          order: 11,
          name: "Close Ticket",
          fnString: "closeTicket",
        },
        {
          order: 14,
          name: "Cancel Ticket By User",
          fnString: "cancelTicketByUser",
        },
      ],
    },
    {
      role: "support",
      actions: [
        {
          order: 2,
          name: "Open Ticket on behalf", // This is only needed on the view tickets screen
        },
        {
          order: 4,
          name: "Allocate to Self",
          fnString: "allocateToSelf",
        },
        {
          order: 5,
          name: "Check Ticket",
          fnString: "checkTicket",
        },
        {
          order: 6,
          name: "Reallocate Ticket",
          fnString: "reallocateTicket",
        },
        {
          order: 7,
          name: "Solve Ticket",
          fnString: "solveTicket",
        },
        {
          order: 9,
          name: "Suspend Ticket",
          fnString: "suspendTicket",
        },
        {
          order: 13,
          name: "Cancel Ticket By Support",
          fnString: "cancelTicketBySupport",
        },
        {
          order: 15,
          name: "Cancel Abandoned Ticket",
          fnString: "cancelAbandonedTicket",
        },
      ],
    },
    {
      role: "admin",
      actions: [
        {
          order: 3,
          name: "Allocate To Support",
          fnString: "allocateToSupport",
        },
        {
          order: 12,
          name: "Close Expired Ticket",
          fnString: "closeExpiredTicket",
        },
      ],
    },
  ];
  return actions;
};

export default {
  statusToString,
  getStatusFromString,
  getActionsForRole,
  getActionByID,
  getAllActions,
  getActionByIDAsync,
};

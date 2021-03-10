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

const getActionByIDAsync = async (id) => {
  if (!id) return {};
  const actions = await getAllActions();
  return actions
    .find((role) => role.actions.find((action) => action.order === id))
    .actions.find((action) => action.order === id);
};

const getActionByID = (actions, id) => {
  if (!id || !actions) return {};
  return actions.find((action) => action.order === id);
};

const getAvailableActionsForTicket = (allUserActions, lastStatus) => {
  if (!lastStatus || !lastStatus.availableActions) return {};
  return allUserActions.filter((action) =>
    lastStatus.availableActions.some((statusID) => {
      return statusID === action.order;
    })
  );
};

const getLatestTicketStatusByDate = (statusHistory) => {
  return statusHistory.reduce((r, a) =>
    new Date(r.date) > new Date(a.date) ? r : a
  );
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const getAllActions = async () => {
  const actions = [
    {
      role: "client",
      actions: [
        {
          order: 1,
          name: "Open Ticket",
          availableActions: [3, 4, 14],
        },
        {
          order: 8,
          name: "Reopen Ticket",
          fnString: "reopenTicket",
          availableActions: [5],
        },
        {
          order: 10,
          name: "Add More Information",
          fnString: "addMoreInfo",
          availableActions: [5],
        },
        {
          order: 11,
          name: "Close Ticket",
          fnString: "closeTicket",
          availableActions: [],
        },
        {
          order: 14,
          name: "Cancel Ticket By User",
          fnString: "cancelTicketByUser",
          availableActions: [],
        },
      ],
    },
    {
      role: "support",
      actions: [
        {
          order: 2,
          name: "Open Ticket on behalf", // This is only needed on the view tickets screen
          availableActions: [3, 4, 14],
        },
        {
          order: 4,
          name: "Allocate to Self",
          fnString: "allocateToSelf",
          availableActions: [5],
        },
        {
          order: 5,
          name: "Check Ticket",
          fnString: "checkTicket",
          availableActions: [6, 7, 9, 13],
        },
        {
          order: 6,
          name: "Reallocate Ticket",
          fnString: "reallocateTicket",
          availableActions: [5],
        },
        {
          order: 7,
          name: "Solve Ticket",
          fnString: "solveTicket",
          availableActions: [11, 12],
        },
        {
          order: 9,
          name: "Suspend Ticket",
          fnString: "suspendTicket",
          availableActions: [10, 14, 15],
        },
        {
          order: 13,
          name: "Cancel Ticket By Support",
          fnString: "cancelTicketBySupport",
          availableActions: [],
        },
        {
          order: 15,
          name: "Cancel Abandoned Ticket",
          fnString: "cancelAbandonedTicket",
          availableActions: [],
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
          availableActions: [5],
        },
        {
          order: 12,
          name: "Close Expired Ticket",
          fnString: "closeExpiredTicket",
          availableActions: [5],
        },
      ],
    },
  ];
  return actions;
};

export default {
  statusToString,
  getStatusFromString,
  getActionByID,
  getAllActions,
  getActionByIDAsync,
  getAvailableActionsForTicket,
  getLatestTicketStatusByDate,
  capitalize,
};

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

const getActionsForRole = (role) => {
  if (!role) return [];
  return getAllActions().find((action) => action.role === role);
};

const getActionByID = (id) => {
  if (!id) return {};
  const actions = getAllActions();
  return actions
    .find((role) => role.actions.find((action) => action.order === id))
    .actions.find((action) => action.order === id);
};

const getAllActions = () => {
  const actions = [
    {
      role: "client",
      actions: [
        {
          order: 1,
          name: "Open Ticket",
          // fnString: "openTicket",
        },
        {
          order: 8,
          name: "Reopen Ticket",
          fnString: "reopenTicket",
        },
        {
          order: 10,
          name: "Add more information",
          fnString: "addMoreInfo",
        },
        {
          order: 11,
          name: "Close Ticket",
          fnString: "closeTicket",
        },
        {
          order: 14,
          name: "Cancel Ticket by user",
          fnString: "cancelTicketByUser",
        },
      ],
    },
    {
      role: "support",
      actions: [
        {
          order: 2,
          name: "Open Ticket on behalf",
        },
        {
          order: 4,
          name: "Allocate to self",
        },
        {
          order: 5,
          name: "Check Ticket",
        },
        {
          order: 6,
          name: "Reallocate Ticket",
        },
        {
          order: 7,
          name: "Solve Ticket",
        },
        {
          order: 9,
          name: "Suspend Ticket",
        },
        {
          order: 13,
          name: "Cancel Ticket by support",
        },
        {
          order: 15,
          name: "Cancel Abandoned Ticket",
        },
      ],
    },
    {
      role: "admin",
      actions: [
        {
          order: 3,
          name: "Allocate to support",
          role: "admin",
        },
        {
          order: 12,
          name: "Close Expired Ticket",
          role: "admin",
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
};

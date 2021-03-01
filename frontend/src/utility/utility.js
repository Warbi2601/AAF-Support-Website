const statusToString = (status) => {
  switch (status) {
    case 0:
      return "Open";
    case 1:
      return "Opened on behalf of another user";
    case 2:
      return "Allocated to support";
    case 2:
      return "Suspended";
    case 3:
      return "Resolved";
    case 4:
      return "Cancelled";
    case 5:
      return "Expired";
    default:
      return "";
  }
};

const getActionsForRole = (role) => {
  if (!role) return [];
  return getAllActions(role).find((action) => action.role === role);
};

const getAllActions = (role) => {
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
        },
        {
          order: 10,
          name: "Add more information",
        },
        {
          order: 11,
          name: "Close Ticket",
        },
        {
          order: 14,
          name: "Cancel Ticket by user",
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
  getActionsForRole,
};

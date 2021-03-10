const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("client") // normal user
    .readOwn("ticket")
    .updateOwn("ticket")
    .createOwn("ticket");

  ac.grant("support").readAny("ticket").createAny("ticket");

  ac.grant("admin").updateAny("ticket").deleteAny("ticket");

  return ac;
})();

//gets all actions that a user can run
exports.getPermissionsForRole = (role) => {
  return this.getAllActions().find((x) => x.role === role);
};

//gets an action by its "order" property
exports.getActionByID = (id) => {
  let allActions = this.getAllActions();
  let action = allActions
    .find((role) => role.actions.find((action) => action.order === id))
    .actions.find((action) => action.order === id);
  return action;
};

// get list of actions that this role can perform from the db
exports.checkTicketActionAccess = (user, action) => {
  try {
    debugger;

    //this will get the object that represents their role including all the actions they can do
    let actions = this.getPermissionsForRole(user.role).actions;

    //Does that user have access to run this action
    let canRunAction = actions
      ? actions?.some((item) => {
          return item.order === action;
        })
      : false;

    return canRunAction;
  } catch (err) {
    console.log("error checking access control", err);
    return false;
  }
};

//this gets all the actions on a role by role basis. this is the single point of data for access control
exports.getAllActions = () => {
  const actions = [
    {
      role: "client",
      actions: [
        {
          order: 1,
          name: "Open Ticket",
          availableActions: [3, 4, 14],
          type: "create",
          currentStatus: "Open",
        },
        {
          order: 8,
          name: "Reopen Ticket",
          fnString: "reopenTicket",
          availableActions: [5],
          type: "update",
          currentStatus: "Open",
        },
        {
          order: 10,
          name: "Add More Information",
          fnString: "addMoreInfo",
          availableActions: [5],
          type: "update",
          currentStatus: "Info Added?????",
        },
        {
          order: 11,
          name: "Close Ticket",
          fnString: "closeTicket",
          availableActions: [],
          type: "update",
          currentStatus: "Closed By User",
        },
        {
          order: 14,
          name: "Cancel Ticket By User",
          fnString: "cancelTicketByUser",
          availableActions: [],
          type: "update",
          currentStatus: "Cancelled By User",
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
          type: "create",
          currentStatus: "Open",
        },
        {
          order: 4,
          name: "Allocate to Self",
          fnString: "allocateToSelf",
          availableActions: [5],
          type: "update",
          currentStatus: "Allocated To Support",
        },
        {
          order: 5,
          name: "Check Ticket",
          fnString: "checkTicket",
          availableActions: [6, 7, 9, 13],
          type: "update",
          currentStatus: "Checked???",
        },
        {
          order: 6,
          name: "Reallocate Ticket",
          fnString: "reallocateTicket",
          availableActions: [5],
          type: "update",
          currentStatus: "Allocated To Support",
        },
        {
          order: 7,
          name: "Solve Ticket",
          fnString: "solveTicket",
          availableActions: [11, 12],
          type: "update",
          currentStatus: "Solved",
        },
        {
          order: 9,
          name: "Suspend Ticket",
          fnString: "suspendTicket",
          availableActions: [10, 14, 15],
          type: "update",
          currentStatus: "Suspended - Awaiting Client Information",
        },
        {
          order: 13,
          name: "Cancel Ticket By Support",
          fnString: "cancelTicketBySupport",
          availableActions: [],
          type: "update",
          currentStatus: "Cancelled By Support",
        },
        {
          order: 15,
          name: "Cancel Abandoned Ticket",
          fnString: "cancelAbandonedTicket",
          availableActions: [],
          type: "update",
          currentStatus: "Abandoned Ticket Cancelled By Support",
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
          type: "update",
          currentStatus: "Allocated To Support",
        },
        {
          order: 12,
          name: "Close Expired Ticket",
          fnString: "closeExpiredTicket",
          availableActions: [5],
          type: "update",
          currentStatus: "Expired Ticket Closed By Admin",
        },
      ],
    },
  ];
  return actions;
};

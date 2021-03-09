const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("client") // normal user
    .readOwn("ticket")
    .updateOwn("ticket")
    .createOwn("ticket");

  ac.grant("support")
    .extend("client") // maybe shouldnt extend client?
    .readAny("ticket")
    .createAny("ticket");

  ac.grant("admin")
    // .extend("client") // maybe shouldnt extend client?
    .extend("support")
    .updateAny("ticket")
    .deleteAny("ticket");

  return ac;
})();

exports.getAllActions = () => {
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

// //Client
// "reopen-ticket"
// "add-information"
// "/close-ticket"
// "/cancel-ticket-user"

// //Support
// "/allocate-ticket-self"
// "/check-ticket"
// "/reallocate-ticket"
// "/solve-ticket"
// "/suspend-ticket"
// "/cancel-ticket-support"
// "/cancel-abandoned-ticket"

// //Admin
// "/allocate-ticket-support",
// "/close-ticket-expired"

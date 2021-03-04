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

// const actions = [
//   {
//     role: "client",
//     actions: [
//       {
//         order: 1,
//         name: "Open Ticket",
//         // fnString: "openTicket", // This is only needed on the view tickets screen
//       route: ""
//       },
//       {
//         order: 8,
//         name: "Reopen Ticket",
//         fnString: "reopenTicket",
//       },
//       {
//         order: 10,
//         name: "Add more information",
//         fnString: "addMoreInfo",
//       },
//       {
//         order: 11,
//         name: "Close Ticket",
//         fnString: "closeTicket",
//       },
//       {
//         order: 14,
//         name: "Cancel Ticket by user",
//         fnString: "cancelTicketByUser",
//       },
//     ],
//   },
//   {
//     role: "support",
//     actions: [
//       // {
//       //   order: 2,
//       //   name: "Open Ticket on behalf", // This is only needed on the view tickets screen
//       // },
//       {
//         order: 4,
//         name: "Allocate to self",
//       },
//       {
//         order: 5,
//         name: "Check Ticket",
//       },
//       {
//         order: 6,
//         name: "Reallocate Ticket",
//       },
//       {
//         order: 7,
//         name: "Solve Ticket",
//       },
//       {
//         order: 9,
//         name: "Suspend Ticket",
//       },
//       {
//         order: 13,
//         name: "Cancel Ticket by support",
//       },
//       {
//         order: 15,
//         name: "Cancel Abandoned Ticket",
//       },
//     ],
//   },
//   {
//     role: "admin",
//     actions: [
//       {
//         order: 3,
//         name: "Allocate to support",
//         role: "admin",
//       },
//       {
//         order: 12,
//         name: "Close Expired Ticket",
//         role: "admin",
//       },
//     ],
//   },
// ];

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
//   "/allocate-ticket-support",
// "/close-ticket-expired"

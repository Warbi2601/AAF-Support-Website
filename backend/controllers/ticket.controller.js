const Ticket = require("../models/ticket.model");

exports.addTicket = (req, res) => {
  // setTimeout(() => {
  //need to possibly assign the ticket here
  const obj = req.body;
  obj.loggedBy = req.userID;
  obj.status = 0; // Sets status to created
  const ticket = new Ticket(obj);
  ticket.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error logging your ticket, try again.");
    } else {
      res.status(200).json({
        success: "Ticket successfully added!",
        ticketID: ticket._id,
      });
    }
  });
  // }, 10000);
};

exports.getTicket = (req, res) => {
  let id = req.params.id;
  Ticket.findOne({ _id: id }, function (err, ticket) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again",
      });
    } else {
      res.status(200).json(ticket);
    }
  })
    .populate("loggedBy")
    .populate("loggedFor")
    .populate("assignedTo");
};

exports.getAllTickets = (req, res) => {
  console.log("Get all tickets called");
  Ticket.find()
    .populate("loggedBy")
    .populate("loggedFor")
    .populate("assignedTo")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving Tickets.",
      });
    });
};

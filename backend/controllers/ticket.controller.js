const Ticket = require("../models/ticket.model");

exports.addTicket = (req, res) => {
  //   const { email, password,  } = req.body;
  //   const user = new User({ email, password });
  const ticket = new Ticket(req.body);
  ticket.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error logging your ticket, try again.");
    } else {
      res.status(200).send("Ticket successfully added");
    }
  });
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

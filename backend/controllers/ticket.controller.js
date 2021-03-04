const Ticket = require("../models/ticket.model");

exports.addTicket = (req, res) => {
  // setTimeout(() => {
  const user = res.locals.loggedInUser;
  const obj = req.body;
  obj.loggedBy = user._id;
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
  const user = res.locals.loggedInUser;

  let filter =
    user.role === "client"
      ? { $or: [{ loggedBy: user._id }, { loggedFor: user._id }] }
      : {};

  Ticket.find(filter)
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

exports.updateTicket = async (req, res) => {
  try {
    const { ticket, action } = req.body;
    const user = res.locals.loggedInUser;
    ticket.statusHistory.push({
      date: new Date(),
      action: action,
      userName: `${user.firstName} ${user.lastName} (${user.email})`,
    });

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticket._id },
      ticket,
      // If `new` isn't true, `findOneAndUpdate()` will return the
      // document as it was _before_ it was updated.
      { new: true }
    );

    // If the function returns null then it didnt update
    if (!updatedTicket)
      res.status(500).json({
        error: "Something went wrong when updating the ticket",
      });

    res.status(200).json({
      success: "Ticket Updated",
    });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong when updating the ticket",
    });
  }
};

const Ticket = require("../models/ticket.model");
const roles = require("../roles");

exports.addTicket = (req, res) => {
  const user = res.locals.loggedInUser;

  const { ticket, action } = req.body;
  ticket.loggedBy = user._id;

  if (user.role === "support" && !ticket.loggedFor) {
    res.status(400).json({
      error: "You need to select a user to create this ticket on behalf of",
    });
    return;
  }

  if (user.role === "client" && ticket.loggedFor) {
    res.status(400).json({
      error: "You can't create a ticket on behalf of another user",
    });
    return;
  }

  const actionObj = roles.getActionByID(action);

  ticket.statusHistory = [];
  ticket.statusHistory.push({
    date: new Date(),
    action: actionObj.order,
    actionName: actionObj.name,
    user: {
      _id: user._id,
      name: `${user.firstName} ${user.lastName} (${user.email})`,
    },
    availableActions: actionObj.availableActions,
  });

  const newTicket = new Ticket(ticket);
  newTicket.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error logging your ticket, try again." });
    } else {
      res.status(200).json({
        success: "Ticket successfully added!",
        ticketID: newTicket._id,
      });
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
      return;
    }

    if (!ticket) {
      res.status(404).json({
        error: "Ticket not found",
      });
      return;
    }

    const user = res.locals.loggedInUser;

    // make sure that a user can't see a ticket that isn't their own
    if (
      user.role === "client" &&
      (user._id === ticket.loggedBy._id || user._id === ticket.loggedFor._id)
    ) {
      res.status(403).json({
        error: "You do not have permission to view this ticket",
      });
      return;
    }

    res.status(200).json(ticket).send();
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
      res.status(500).json({
        error: err.message || "An error occurred while retrieving Tickets.",
      });
    });
};

exports.updateTicket = async (req, res) => {
  try {
    const { ticket, action } = req.body;
    const actionObj = roles.getActionByID(action);
    const user = res.locals.loggedInUser;

    ticket.statusHistory.push({
      date: new Date(),
      action: actionObj.order,
      actionName: actionObj.name,
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName} (${user.email})`,
      },
      availableActions: actionObj.availableActions,
      currentStatus: actionObj.currentStatus,
    });

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticket._id },
      ticket,
      // If `new` isn't true, `findOneAndUpdate()` will return the
      // document as it was _before_ it was updated.
      { new: true }
    );

    // If the function returns null then it didnt update
    if (!updatedTicket) {
      res.status(500).json({
        error: "Something went wrong when updating the ticket",
      });
      return;
    }

    res.status(200).json({
      success: "Ticket updated",
    });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong when updating the ticket",
    });
  }
};

exports.deleteTicket = (req, res) => {
  let ticketID = req.params.id;
  Ticket.deleteOne({ _id: ticketID }, function (err) {
    if (err) {
      res.status(500).json({
        error: "Error deleting the ticket",
      });
    } else {
      res.status(200).json({
        success: "Ticket successfully deleted",
      });
    }
  });
};

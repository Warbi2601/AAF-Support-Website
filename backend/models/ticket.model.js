const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    issue: {
      type: String,
    },
    dateLogged: {
      type: Date,
    },
    loggedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    loggedFor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    department: {
      type: String,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "tickets",
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);

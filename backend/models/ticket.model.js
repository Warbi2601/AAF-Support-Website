const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    issue: {
      type: String,
      required: true,
    },
    dateLogged: {
      type: Date,
      required: true,
      default: Date.now,
    },
    loggedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    loggedFor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    department: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    statusHistory: {
      type: [Schema.Types.Mixed],
      required: true,
    },
    moreInfo: {
      type: [Schema.Types.Mixed],
    },
  },
  {
    collection: "tickets",
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);

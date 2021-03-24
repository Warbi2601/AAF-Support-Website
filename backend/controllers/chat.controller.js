const Ticket = require("../models/ticket.model");

exports.getAllActiveChats = (req, res) => {
  try {
    //get all tickets
    const user = res.locals.loggedInUser;

    //RBAC
    if (user.role === "client" || "admin") {
      return res.status(403).json({
        error: "You don't have permission to perform this action",
      });
    }

    Ticket.find({ "chatHistory.active": true }, function (err, tickets) {
      debugger;

      if (err) {
        console.log("Something went wrong when getting active chats -> ", err);
        return;
      }

      console.log(tickets);

      res.status(200).json(tickets);
    });
  } catch (err) {
    console.log("Exception caught when getting active chats -> ", err);
  }
};

exports.saveTicketChat = (
  ticketID,
  chatID,
  userID,
  userName,
  dateSent,
  message
) => {
  let msg = {
    date: dateSent,
    userID: userID,
    userName: userName,
    message: message,
  };

  try {
    Ticket.findOne({ _id: ticketID }, function (err, ticket) {
      if (err) {
        console.error(err);
        return;
      }

      if (!ticket) {
        console.log("Ticket not found - ", ticketID);
        return;
      }

      let chat = ticket.chatHistory.find((x) => x.chatID === chatID);

      if (chat != null) {
        //chat already exists so lets just push the message onto (should probably still log messages even if it isn't active)
        // if (chat.active) chat.messages.push(msg);
        chat.messages.push(msg);
      } else {
        //chat doesn't exist so lets create it
        let newMessagesArray = [];
        newMessagesArray.push(msg);

        ticket.chatHistory.push({
          chatID: chatID,
          active: true,
          messages: newMessagesArray,
        });
      }

      ticket.markModified("chatHistory");
      ticket.save();
    });
  } catch (err) {
    console.log(
      "Exception caught when adding the chat message to the ticket -> ",
      err
    );
  }
};

exports.endChat = (chatID) => {
  //find the ticket that the chat is about
  try {
    Ticket.findOne({ "chatHistory.chatID": chatID }, function (err, ticket) {
      if (err) {
        console.log("Something went wrong when ending the chat -> ", err);
        return;
      }

      if (!ticket) {
        console.log("Couldnt find ticket when ending the chat -> ", err);
        return;
      }

      //update the chat object
      let chat = ticket.chatHistory?.find((x) => x.chatID === chatID);
      if (!chat) return; // incase anything has gone wrong dont crash the server

      chat.active = false;

      //needed for it to update
      ticket.markModified("chatHistory");
      ticket.save();
    });
  } catch (err) {
    console.log("Exception caught when ending the chat -> ", err);
  }
};

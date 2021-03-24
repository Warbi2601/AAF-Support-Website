import React, { useContext, useState } from "react";
// import "../../chat/room.css";
import formatting from "../../utility/formatting";
import moment from "moment";
import { UserContext } from "../../context/UserContext";

const Messages = ({ messages }) => {
  const { user } = useContext(UserContext);

  return !messages ||
    !Array.isArray(messages) ||
    messages.length <= 0 ? null : (
    <div className="chat-room-container">
      <div className="messages-container">
        <ol className="messages-list">
          {messages.map((message, i) => {
            console.log("message", message);
            return (
              <li
                key={i}
                className={`message-item ${
                  message.userID === user._id
                    ? "my-message"
                    : "received-message"
                }`}
              >
                <div className="message-username">
                  {!message.userID ? "Deleted User" : message.userName} -{" "}
                  {moment(message.date).format(formatting.dateTimeFormat)}
                </div>
                <div className="message-content">{message.message}</div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default Messages;

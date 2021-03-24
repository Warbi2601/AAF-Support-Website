import React, { useContext } from "react";
import "../../chat/room.css";
import { Button } from "react-bootstrap";
import useChat from "../../chat/chatManager";
import formatting from "../../utility/formatting";
import moment from "moment";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";

const Room = (props) => {
  const { roomId, ticketID } = props.match.params;
  const { messages, sendMessage } = useChat(roomId, ticketID);
  const [newMessage, setNewMessage] = React.useState("");

  const { user } = useContext(UserContext);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (!newMessage) {
      toast.error("The message box is empty");
      return;
    }
    sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-room-container">
      <h3>Welcome to Uni-Desk Live Chat</h3>

      {user.role === "client" && (
        <h6>
          Please note that the agent won't be able to read any messages sent
          before they join, wait for them to connect before detailing your
          issue. (navigating away from this page will end this live chat however
          you can return to it by pressing back on your browser if it was done
          in error. You will still be able to see the history of this chat on
          the ticket details screen)
        </h6>
      )}
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
                  {message.userName} -{" "}
                  {moment(message.dateSent).format(formatting.dateTimeFormat)}
                </div>
                <div className="message-content">{message.body}</div>
              </li>
            );
          })}
        </ol>
      </div>
      <br />
      <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Write a message..."
        className="new-message-input-field"
      />
      <br />

      <Button
        variant="success"
        onClick={handleSendMessage}
        className="send-message-button"
      >
        Send
      </Button>
    </div>
  );
};

export default Room;

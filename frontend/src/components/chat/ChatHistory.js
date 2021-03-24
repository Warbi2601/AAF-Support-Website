import React, { useState } from "react";
import "../../chat/room.css";
import formatting from "../../utility/formatting";
import moment from "moment";
import Table from "../Table";
import Messages from "./Messages";

const ChatHistory = ({ chatHistory }) => {
  const [messages, setMessages] = useState([]);

  const showChat = (chat) => {
    console.log(chat);
    setMessages(chat.messages);
  };

  const columns = [
    {
      name: "Date Started",
      selector: (row) =>
        moment(row.messages[0]?.date).format(formatting.dateTimeFormat),
      sortable: true,
    },
    {
      name: "Opening Message",
      selector: (row) => row.messages[0]?.message,
      sortable: true,
    },
  ];

  // save any issues later with nulls/empties
  return !chatHistory ||
    chatHistory.length <= 0 ||
    !Array.isArray(chatHistory) ? (
    <div>
      <h4>There is no live chat history for this ticket</h4>
    </div>
  ) : (
    <div>
      <Table
        columns={columns}
        data={chatHistory}
        onRowClicked={(item) => {
          showChat(item);
        }}
        theme="default"
      />

      <Messages messages={messages} />
    </div>
  );
};

export default ChatHistory;

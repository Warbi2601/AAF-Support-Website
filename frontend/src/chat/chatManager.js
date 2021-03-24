import { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { UserContext } from "../context/UserContext";

const newchatmsg = "newMsg";
//Why is it a bad idea to have this here in production?
const chatUrl = "http://localhost:4000";

const useChat = (roomId, ticketID) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const { user } = useContext(UserContext);

  useEffect(() => {
    socketRef.current = socketIOClient(chatUrl, {
      query: { roomId },
    });

    socketRef.current.on(newchatmsg, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(newchatmsg, {
      body: messageBody,
      senderId: socketRef.current.id,
      ticketID: ticketID,
      chatID: roomId,
      userID: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      dateSent: new Date(),
    });
  };

  return { messages, sendMessage };
};

export default useChat;

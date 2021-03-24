import { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { UserContext } from "../context/UserContext";

const newchatmsg = "newMsg";
const disconnect = "chat-disconnect";
const connect = "chat-connect";
//Why is it a bad idea to have this here in production?
const chatUrl = "http://localhost:4000";
// const chatUrl = process.env.SOCKETIOURL;

const useChat = (roomId, ticketID) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const { user } = useContext(UserContext);

  useEffect(() => {
    socketRef.current = socketIOClient(chatUrl, {
      query: { roomId },
    });

    socketRef.current.emit(connect, buildMessage("User Connected"));

    socketRef.current.on(newchatmsg, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    socketRef.current.on(connect, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    socketRef.current.on(disconnect, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      if (user) {
        socketRef.current.emit(disconnect, buildMessage("User Disconnected"));
      }
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(newchatmsg, buildMessage(messageBody));
  };

  const buildMessage = (messageBody) => {
    return {
      body: messageBody,
      senderId: socketRef.current.id,
      ticketID: ticketID,
      chatID: roomId,
      userID: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      dateSent: new Date(),
    };
  };

  return { messages, sendMessage };
};

export default useChat;

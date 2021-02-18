import React from "react";
import { Button } from "react-bootstrap";
import "../../chat/lobby.css";

const Lobby = () => {
  const [roomId, prepareRoom] = React.useState("");

  const onRoomIdChange = (event) => {
    prepareRoom(event.target.value);
  };

  return (
    <div className="lobby-container">
      <input
        type="text"
        placeholder="Which room would you like to join?"
        value={roomId}
        onChange={onRoomIdChange}
        className="text-input-field"
      />
      <Button variant="success" href={`/room/${roomId}`}>
        Join room
      </Button>
    </div>
  );
};

export default Lobby;

import React from "react";
import { TrashFill } from "react-bootstrap-icons";

const Animals = (props) => {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.species}</td>
      <td>{props.breed}</td>
      <td>{props.age}</td>
      <td>{props.colour}</td>
      <td>
        <TrashFill color="red" onClick={() => props.onDelete(props)} />
      </td>
    </tr>
  );
};

export default Animals;

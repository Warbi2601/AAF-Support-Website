import React from "react";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import DataTable, { createTheme } from "react-data-table-component";

import Loader from "./Loader/Loader";

createTheme("solarized", {
  text: {
    primary: "#FFF",
    secondary: "#FFF",
  },
  background: {
    default: "#263763",
  },
  context: {
    background: "#263763",
    text: "#FFFFFF",
  },
  divider: {
    default: "#FFFFFF",
  },
  striped: {
    default: "#1d2b4f",
    text: "#FFFFFF",
  },
  // action: {
  //   button: "rgba(0,0,0,.54)",
  //   hover: "rgba(0,0,0,.08)",
  //   disabled: "rgba(0,0,0,.12)",
  // },
});

function Table({
  keyField = "_id",
  pagination = true,
  sortIcon = <ArrowDownward />,
  fixedHeader = true,
  highlightOnHover = true,
  striped = true,
  progressComponent = <Loader />,
  theme = "solarized",
  ...props
}) {
  if (props.onRowClicked) props.pointerOnHover = true;
  return (
    <DataTable
      fixedHeader={fixedHeader}
      keyField={keyField}
      pagination={pagination}
      sortIcon={sortIcon}
      highlightOnHover={highlightOnHover}
      // pointerOnHover={pointerOnHover}
      progressComponent={progressComponent}
      // progressPending={props.data.length < 1}
      striped={striped}
      theme={theme}
      {...props}
    />
  );
}

export default Table;

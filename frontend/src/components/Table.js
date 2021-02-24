import React from "react";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import DataTable from "react-data-table-component";

import Loader from "./Loader";

function Table({
  keyField = "_id",
  pagination = true,
  sortIcon = <ArrowDownward />,
  fixedHeader = true,
  highlightOnHover = true,
  striped = true,
  progressComponent = <Loader />,
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
      progressPending={props.data.length < 1}
      striped={striped}
      {...props}
    />
  );
}

export default Table;

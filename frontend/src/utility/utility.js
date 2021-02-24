const statusToString = (status) => {
  switch (status) {
    case 0:
      return "Created";
    case 1:
      return "Allocated";
    case 2:
      return "Suspended";
    case 3:
      return "Resolved";
    case 4:
      return "Cancelled";
    case 5:
      return "Expired";
    default:
      return "";
  }
};

export default {
  statusToString,
};

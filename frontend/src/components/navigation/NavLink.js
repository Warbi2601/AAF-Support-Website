import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const NavLink = (props) => {
  const location = useLocation();
  var isActive = location.pathname === props.to;
  if (location.pathname === "/") isActive = props.to === "/home"; // so it will work on the / route
  var className = isActive ? "nav-link active" : "nav-link";

  return (
    <Link class={className} {...props}>
      {props.children}
    </Link>
  );
};

export default NavLink;

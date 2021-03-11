import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import websiteLogo from "../images/logo.png";
import NavLink from "./navigation/NavLink";

const Navigation = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Navbar collapseOnSelect fixed="top" expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to={"/home"}>
            <img src={websiteLogo} style={{ height: "43px", width: "43px" }} />
            <span className="navTitle">Uni-Desk</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {/* <Nav> */}
            <Nav className="mr-auto main-nav">
              <Nav.Link as={NavLink} to={"/home"}>
                Home
              </Nav.Link>

              {user && (
                <>
                  <Nav.Link as={NavLink} to={"/tickets"}>
                    Tickets
                  </Nav.Link>
                  <Nav.Link as={NavLink} to={"/chatLobby"}>
                    Chat Lobby
                  </Nav.Link>
                </>
              )}

              {!user ||
                (user.role === "admin" && (
                  <Nav.Link as={NavLink} to={"/admin-center"}>
                    Admin Center
                  </Nav.Link>
                ))}
            </Nav>
            <Nav>
              {!user ? (
                <>
                  <Nav.Link as={Link} to={"/login"}>
                    {/* <button className="btn-default btn-">Login</button> */}
                    <button type="button" class="btn btn-primary">
                      Login
                    </button>
                  </Nav.Link>
                  <Nav.Link as={Link} to={"/register"}>
                    <button type="button" class="btn btn-outline-primary">
                      Register
                    </button>
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to={"/logout"}>
                  <button type="button" class="btn btn-primary">
                    Logout
                  </button>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* @todo Remove this debugger */}
      <p
        style={{
          fontSize: "10px",
          margin: 0,
          position: "absolute",
          top: 30,
          left: 15,
          zIndex: 9999,
        }}
      >
        {user && `Logged in as ${user?.role}`}
      </p>
    </>
  );
};

export default Navigation;

// <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
//   <NavDropdown.Item href="#action/3.1">
//   Action
//   </NavDropdown.Item>
//   <NavDropdown.Item href="#action/3.2">
//   Another action
//   </NavDropdown.Item>
//   <NavDropdown.Item href="#action/3.3">
//   Something
//   </NavDropdown.Item>
//   <NavDropdown.Divider />
//   <NavDropdown.Item href="#action/3.4">
//   Separated link
//   </NavDropdown.Item>
// </NavDropdown>

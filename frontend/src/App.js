import React, { useEffect, useState, useMemo } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import "./styles/site.scss";
import Home from "./components/Home";
// import Secret from "./components/Secret";
import WithAuth from "./components/filters/WithAuth";
import AlreadyAuthed from "./components/filters/AlreadyAuthed";
import Lobby from "./components/chat/Lobby";
import Room from "./components/chat/Room";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Tickets from "./screens/Tickets";
import TicketDetails from "./screens/TicketDetails";
import CreateTicket from "./screens/CreateTicket";
import axios from "axios";
import settings from "./settings/settings";
import { UserContext } from "./context/UserContext";
import Logout from "./screens/Logout";
import CheckAuth from "./screens/CheckAuth";
import LoadingIndicator from "./components/Loader/LoadingIndicator";

function App() {
  // axios.defaults.headers.common["x-access-token"] = "HELLO";
  // axios.defaults.withCredentials = true;

  // D:\Uni\Year3\AppsAndFrameworks\Week11\mongodb-win32-x86_64-windows-4.4.2/bin/mongod.exe --dbpath D:\Uni\Year3\AppsAndFrameworks\Week11\Testing-Start\data --nojournal

  //   axios.interceptors.response.use((response) => {
  //     return response;
  // }, function (error) {
  //     // Do something with response error
  //     if (error.response.status === 401) {
  //         console.log('unauthorized, logging out ...');
  //         auth.logout();
  //         router.replace('/auth/login');
  //     }
  //     return Promise.reject(error.response);
  // });

  // axios.interceptors.response.use(
  //   function (response) {
  //     if (response.data.success) toast.success(response.data.success);
  //     return response;
  //   },
  //   function (error) {
  //     if (error.response.data.error) toast.error(error.response.data.error);
  //     return Promise.reject(error);
  //   }
  // );

  const [user, setUser] = useState(null);

  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  const checkLoginStatus = () => {
    if (!user) {
      console.log("No user state, requesting it from server");
      axios
        .get(settings.authUrl + "/checkToken", { withCredentials: true })
        .then((res) => setUser(res.data))
        .catch((error) => console.log("check login error", error));
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <UserContext.Provider value={providerValue}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Router>
        <div className="App">
          <header className="App-header">
            <Navbar bg="dark" variant="dark">
              <Container>
                <Nav className="justify-content-end">
                  <Nav>
                    <Link to={"/home"} className="nav-link">
                      Home
                    </Link>
                  </Nav>
                  {/* <Nav>
                    <Link to={"/secret"} className="nav-link">
                      Secret
                    </Link>
                  </Nav> */}

                  {!user && (
                    <Nav>
                      <Link to={"/login"} className="nav-link">
                        Login
                      </Link>
                    </Nav>
                  )}
                  {!user && (
                    <Nav>
                      <Link to={"/register"} className="nav-link">
                        Register
                      </Link>
                    </Nav>
                  )}
                  {user && (
                    <Nav>
                      <Link to={"/logout"} className="nav-link">
                        Logout
                      </Link>
                    </Nav>
                  )}
                  {/* <Nav>
                    <Link to={"/create-ticket"} className="nav-link">
                      Create Ticket
                    </Link>
                  </Nav> */}

                  <Nav>
                    <Link to={"/tickets"} className="nav-link">
                      Tickets
                    </Link>
                  </Nav>
                  <Nav>
                    <Link to={"/chatLobby"} className="nav-link">
                      Chat Lobby
                    </Link>
                  </Nav>
                </Nav>
              </Container>
            </Navbar>
            {/* @todo Remove this debugger */}
            <p style={{ fontSize: "10px", margin: 0 }}>
              {user && `Logged in as ${user?.role}`}
            </p>
          </header>

          <Container>
            <Row>
              <Col md={12}>
                <div className="wrapper">
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/home" component={Home} />
                    <Route
                      exact
                      path="/check-auth"
                      component={WithAuth(CheckAuth)}
                    />
                    {/* <Route exact path="/secret" component={WithAuth(Secret)} /> */}
                    <Route
                      exact
                      path="/login"
                      component={AlreadyAuthed(Login)}
                    />
                    <Route exact path="/logout" component={WithAuth(Logout)} />
                    <Route
                      exact
                      path="/register"
                      component={AlreadyAuthed(Register)}
                    />
                    <Route
                      exact
                      path="/create-ticket"
                      component={WithAuth(CreateTicket)}
                    />
                    <Route
                      exact
                      path="/tickets"
                      component={WithAuth(Tickets)}
                    />
                    <Route
                      exact
                      path="/ticket-details/:id"
                      component={WithAuth(TicketDetails)}
                    />
                    <Route path="/chatLobby" component={WithAuth(Lobby)} />
                    <Route path="/room/:roomId" component={WithAuth(Room)} />
                  </Switch>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Router>
      <LoadingIndicator />
    </UserContext.Provider>
  );
}

export default App;

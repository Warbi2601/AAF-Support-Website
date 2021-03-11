import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import CreateTicket from "../screens/CreateTicket";

const mockUsers = [
  {
    _id: "603b91c038b9281384eb871f",
    role: "client",
    email: "a@a.com",
    firstName: "Josh",
    lastName: "Warburton",
  },
  {
    _id: "603b91c038b9227544eb867d",
    role: "client",
    email: "b@b.com",
    firstName: "Jay",
    lastName: "Thomas",
  },
  {
    _id: "603b91c038b9267954eb837q",
    role: "client",
    email: "c@c.com",
    firstName: "John",
    lastName: "Davies",
  },
];

describe("Create Ticket Component", () => {
  //promise stuff needed for handling state updates
  let promise = Promise.resolve();
  let handleSubmit = jest.fn(() => promise);

  let issueGood = "Broken Laptop";
  let departmentGood = "IT";
  let loggedForGood = "603b91c038b9227544eb867d";
  let issueBad = "";
  let departmentBad = "";
  let loggedForBad = "";

  const server = setupServer(
    rest.get("/api/users", (req, res, ctx) => {
      return res(ctx.json(mockUsers));
    })
  );

  beforeAll(() => server.listen());
  afterEach(async () => {
    server.resetHandlers();
    await act(() => promise);
    promise = Promise.resolve();
    handleSubmit = jest.fn(() => promise);
  });
  afterAll(() => server.close());

  it("Render Form for support", async () => {
    render(<CreateTicket forSelf={false} />);

    await waitFor(() => screen.getByTestId("loggedFor")); // wait until the http request has finished

    expect(screen.getByTestId("loggedFor")).toBeInTheDocument();
    //check that all the options are only users that have client as their role
    expect(screen.getByRole("button")).toHaveAttribute("disabled"); //should be disabled on first render
  });

  it("Render Form for client", async () => {
    render(<CreateTicket forSelf={true} />);
    expect(screen.queryByTestId("loggedFor")).toBeNull(); // the client should never be shown this field
    expect(screen.getByRole("button")).toHaveAttribute("disabled"); //should be disabled on first render
  });

  it("Submit form as client - good data", async () => {
    render(<CreateTicket onSubmit={handleSubmit} forSelf={true} />);

    //type some information into the more details field and submit
    userEvent.type(screen.getByLabelText(/Issue/i), issueGood);
    userEvent.type(screen.getByLabelText(/Department/i), departmentGood);
    userEvent.click(screen.getByRole("button", { type: /submit/i }));

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(
        {
          issue: issueGood,
          department: departmentGood,
        },
        expect.anything()
      )
    );
  });

  it("Submit form as client - bad data", async () => {
    render(<CreateTicket onSubmit={handleSubmit} forSelf={true} />);

    //type some information into the more details field and submit
    userEvent.type(screen.getByLabelText(/Issue/i), issueBad);
    userEvent.type(screen.getByLabelText(/Department/i), departmentBad);
    userEvent.click(screen.getByRole("button", { type: /submit/i }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("Submit form as support - good data", async () => {
    render(<CreateTicket onSubmit={handleSubmit} forSelf={false} />);

    await waitFor(
      () =>
        screen.getByTestId("loggedFor") &&
        screen.getAllByTestId("loggedForOption")
    ); // wait until the http request has finished

    //type some information into the more details field and submit
    userEvent.type(screen.getByLabelText(/Issue/i), issueGood);
    userEvent.type(screen.getByLabelText(/Department/i), departmentGood);

    //select a loggedFor here and assert that the correct one is selected
    fireEvent.change(screen.getByLabelText("Logged on behalf of"), {
      target: { value: loggedForGood },
    });
    let options = screen.getAllByTestId("loggedForOption");
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeTruthy();
    expect(options[2].selected).toBeFalsy();
    userEvent.click(screen.getByRole("button", { type: /submit/i }));

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(
        {
          issue: issueGood,
          department: departmentGood,
          loggedFor: loggedForGood,
        },
        expect.anything()
      )
    );
  });

  it("Submit form as support - bad data", async () => {
    render(<CreateTicket onSubmit={handleSubmit} forSelf={false} />);

    //type some information into the more details field and submit
    userEvent.type(screen.getByLabelText(/Issue/i), issueBad);
    userEvent.type(screen.getByLabelText(/Department/i), departmentBad);
    userEvent.click(screen.getByRole("button", { type: /submit/i }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });
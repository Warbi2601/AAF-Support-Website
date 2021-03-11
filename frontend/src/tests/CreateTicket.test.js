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
    role: "support",
    email: "b@b.com",
    firstName: "Jay",
    lastName: "Thomas",
  },
  {
    _id: "603b91c038b9267954eb837q",
    role: "admin",
    email: "c@c.com",
    firstName: "John",
    lastName: "Davies",
  },
];

describe("Create Ticket Component", () => {
  const server = setupServer(
    rest.get("/api/users", (req, res, ctx) => {
      return res(ctx.json(mockUsers));
    })
  );

  beforeAll(() => server.listen());
  afterEach(async () => {
    server.resetHandlers();
    await act(() => promise);
  });
  afterAll(() => server.close());

  //promise stuff needed for handling state updates
  let promise = Promise.resolve();
  let handleSubmit = jest.fn(() => promise);

  //   afterEach(async () => {
  //      // needed for handling state updates
  //   });

  //   it("Render Form for client", async () => {
  //     render(<CreateTicket forSelf={false} />);

  //     expect(
  //       screen.getByLabelText("Logged on behalf of")
  //     ).not.toBeInTheDocument();
  //  expect(screen.getByRole("button")).toHaveAttribute("disabled");

  //   });

  it("loads and displays greeting", async () => {
    render(<CreateTicket forSelf={false} />);

    // fireEvent.click(screen.getByText("Load Greeting"));

    await waitFor(() => screen.getByLabelText("Logged on behalf of"));

    expect(screen.getByTestId("loggedFor")).toBeInTheDocument();
    // expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });

  //   it("Submitting the Add Information Form with correct data", async () => {
  //     render(<AddInformation onSubmit={handleSubmit} action={action} />);

  //     moreInfo = "Adding some more info to the ticket"; // add the correct data

  //     //type some information into the more details field and submit
  //     userEvent.type(screen.getByLabelText(/More Information/i), moreInfo);
  //     userEvent.click(screen.getByRole("button", { type: /submit/i }));

  //     await waitFor(() =>
  //       expect(handleSubmit).toHaveBeenCalledWith(
  //         {
  //           moreInfo: moreInfo,
  //           action: action,
  //         },
  //         expect.anything()
  //       )
  //     );

  //     await act(() => promise);
  //   });
});

// // __tests__/fetch.test.js
// import React from "react";
// import { rest } from "msw";
// import { setupServer } from "msw/node";
// import { render, fireEvent, waitFor, screen } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
// import TestComp from "../components/TestComp";
// import WithAuth from "../components/filters/WithAuth";
// import Tickets from "../screens/Tickets";
// import UserContext from "../context/UserContext";

// const server = setupServer(
//   rest.get("/greeting", (req, res, ctx) => {
//     return res(ctx.json({ greeting: "hello there" }));
//   })
// );

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// test("loads and displays greeting", async () => {
//   render(<TestComp url="/greeting" />);

//   fireEvent.click(screen.getByText("Load Greeting"));

//   await waitFor(() => screen.getByRole("heading"));

//   expect(screen.getByRole("heading")).toHaveTextContent("hello there");
//   expect(screen.getByRole("button")).toHaveAttribute("disabled");
// });

// /**
//  * A custom render to setup providers. Extends regular
//  * render options with `providerProps` to allow injecting
//  * different scenarios to test with.
//  *
//  * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
//  */
// const customRender = (ui, { providerProps, ...renderOptions }) => {
//   return render(
//     <UserContext.Provider {...providerProps}>{ui}</UserContext.Provider>,
//     renderOptions
//   );
// };

// let mockUser = {
//   _id: "603b91c038b9281384eb871f",
//   role: "client",
//   email: "a@a.com",
//   firstName: "Josh",
//   lastName: "Warburton",
// };

// test("loads and displays statuses", async () => {
//   customRender(<WithAuth ComponentToProtect={Tickets} role={"admin"} />, {
//     mockUser,
//   });

//   // expect(screen.getBy);

//   // fireEvent.click(screen.getByText("Load Greeting"));

//   // await waitFor(() => screen.getByRole("heading"));

//   // expect(screen.getByRole("heading")).toHaveTextContent("hello there");
//   // expect(screen.getByRole("button")).toHaveAttribute("disabled");
// });

// test("handles server error", async () => {
//   server.use(
//     rest.get("/greeting", (req, res, ctx) => {
//       return res(ctx.status(500));
//     })
//   );

//   render(<TestComp url="/greeting" />);

//   fireEvent.click(screen.getByText("Load Greeting"));

//   await waitFor(() => screen.getByRole("alert"));

//   expect(screen.getByRole("alert")).toHaveTextContent("Oops, failed to fetch!");
//   expect(screen.getByRole("button")).not.toHaveAttribute("disabled");
// });

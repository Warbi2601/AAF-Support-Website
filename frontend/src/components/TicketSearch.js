import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CachedIcon from "@material-ui/icons/Cached";

import "../styles/Form.scss";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";
import settings from "../settings/settings";
import { toast } from "react-toastify";
import axios from "axios";

const initialValues = {
  issue: "",
  department: "",
  loggedFor: "",
  loggedBy: "",
  allocatedTo: "",
};

const searchTicketsSchema = Yup.object().shape({
  // issue: Yup.string().required().label("Issue"),
  // loggedFor: forSelf
  //   ? Yup.string().label("Logged on behalf of")
  //   : Yup.string().required().label("Logged on behalf of"), //make the loggedFor required if its being created by support
  // department: Yup.string().required().label("Department"),
});

function TicketSearch({ onSubmit, onReset }) {
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    axios
      .get(settings.apiUrl + "/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={searchTicketsSchema}
      onSubmit={onSubmit}
      //   onSubmit={
      //       async (values, { resetForm }) => {
      //     if (values.loggedFor === "") delete values.loggedFor;
      //     trackPromise(
      //       axios
      //         .post(settings.apiUrl + "/tickets", {
      //           ticket: values,
      //           action: actionID,
      //         })
      //         .then((res) => {
      //           resetForm();
      //           toast.success(res.data.success);
      //           this.props.history.push("/ticket-details/" + res.data.ticketID);
      //         })
      //         .catch((err) => {
      //           toast.error(err.response.data.error);
      //         }),
      //       "create-ticket-area"
      //     );
      //   }
      //}
    >
      {(formik) => {
        console.log("FORMIK", formik);
        return (
          <div>
            <div className="form-container">
              <Form>
                <div className="row">
                  <div className="col-md-4">
                    <FormField
                      formik={formik}
                      name="issue"
                      label="Issue"
                      as="textarea"
                    />
                  </div>
                  <div className="col-md-4">
                    <FormField
                      formik={formik}
                      name="department"
                      label="Department"
                    />
                  </div>
                  <div className="col-md-4">
                    {/* Only show "client"s here as they should be the only ones eligible to have tickets created for them */}
                    <FormField
                      formik={formik}
                      name="loggedFor"
                      label="Logged on behalf of"
                      as="select"
                    >
                      <option value="">Select a user</option>
                      {users.map((user) =>
                        user.role === "client" ? (
                          <option value={user._id}>{user.email}</option>
                        ) : null
                      )}
                    </FormField>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <FormField
                      formik={formik}
                      name="loggedBy"
                      label="Logged By"
                      as="select"
                    >
                      <option value="">Select a user</option>
                      {users.map((user) =>
                        user.role !== "admin" ? (
                          <option value={user._id}>{user.email}</option>
                        ) : null
                      )}
                    </FormField>
                  </div>
                  <div className="col-md-4">
                    <FormField
                      formik={formik}
                      name="assignedTo"
                      label="Allocated To"
                      as="select"
                    >
                      <option value="">Select a user</option>
                      {users.map((user) =>
                        user.role === "support" ? (
                          <option value={user._id}>{user.email}</option>
                        ) : null
                      )}
                    </FormField>
                  </div>
                  <div className="col-md-4"></div>
                </div>

                {/* <hr /> */}

                <div className="row">
                  <div className="col-md-3">
                    <FormButton title="Search Tickets" formik={formik} />
                  </div>
                  <div className="col-md-3">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => onReset(formik.resetForm)}
                    >
                      <CachedIcon />
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default TicketSearch;
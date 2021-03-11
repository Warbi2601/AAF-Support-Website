import React, { Component } from "react";
import axios from "axios";
import settings from "../settings/settings";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import "../styles/Form.scss";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";
import { trackPromise } from "react-promise-tracker";

export default class CreateTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      users: [],
    };
  }

  componentDidMount() {
    if (!this.props.forSelf) {
      axios.get(settings.apiUrl + "/users").then((res) => {
        this.setState({
          users: res.data,
          loading: false,
        });
      });
    }
  }

  render() {
    const forSelf = this.props.forSelf;
    const actionID = forSelf ? 1 : 2; // If its the user logging it themseleves its 1, if its on behalf of a user its 2

    const createTicketSchema = Yup.object().shape({
      issue: Yup.string().required().label("Issue"),
      loggedFor: forSelf
        ? Yup.string().label("Logged on behalf of")
        : Yup.string().required().label("Logged on behalf of"), //make the loggedFor required if its being created by support
      department: Yup.string().required().label("Department"),
    });

    const initialValues = {
      issue: "",
      loggedFor: "",
      department: "",
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={createTicketSchema}
        onSubmit={async (values, { resetForm }) => {
          if (values.loggedFor === "") delete values.loggedFor;
          trackPromise(
            axios
              .post(settings.apiUrl + "/tickets", {
                ticket: values,
                action: actionID,
              })
              .then((res) => {
                resetForm();
                toast.success(res.data.success);
                this.props.history.push("/ticket-details/" + res.data.ticketID);
              })
              .catch((err) => {
                toast.error(err.response.data.error);
              }),
            "create-ticket-area"
          );
        }}
      >
        {(formik) => {
          const { errors, touched, isValid, dirty, isSubmitting } = formik;
          return (
            <div>
              <div className="form-container">
                <Form>
                  <FormField
                    formik={formik}
                    name="issue"
                    label="Issue"
                    as="textarea"
                  />

                  <FormField
                    formik={formik}
                    name="department"
                    label="Department"
                  />

                  {/* Only show "client"s here as they should be the only ones eligible to have tickets created for them */}
                  {!forSelf && !this.state.loading && (
                    <FormField
                      formik={formik}
                      name="loggedFor"
                      label="Logged on behalf of"
                      as="select"
                      data-testid="loggedFor"
                    >
                      <option value="">Select a user</option>
                      {this.state.users.map((user) =>
                        user.role === "client" ? (
                          <option key={user._id} value={user._id}>
                            {user.email}
                          </option>
                        ) : null
                      )}
                    </FormField>
                  )}
                  <hr />

                  <FormButton title="Create Ticket" formik={formik} />
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
}

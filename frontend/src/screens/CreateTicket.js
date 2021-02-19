import React, { Component } from "react";
import axios from "axios";
import settings from "../settings/settings";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import "../styles/Form.scss";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";

const createTicketSchema = Yup.object().shape({
  issue: Yup.string().required().label("Issue"),
  //   loggedBy: Yup.string().required("Email is required"),
  loggedFor: Yup.string().label("Logged on behalf of"), //.length(24)
  department: Yup.string().required().label("Department"),
  //   assignedTo: Yup.string().required("Email is required"),
});

const initialValues = {
  issue: "",
  //   loggedBy: "",
  loggedFor: "",
  department: "",
  //   assignedTo: "",
};

export default class CreateTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      users: [],
    };
  }

  componentDidMount() {
    axios.get(settings.apiUrl + "/users").then((res) => {
      this.setState({
        users: res.data,
        loading: false,
        formSubmitting: false,
        error: "",
      });
    });
  }

  render() {
    return !this.state.loading ? (
      <Formik
        initialValues={initialValues}
        validationSchema={createTicketSchema}
        onSubmit={(values, { resetForm }) => {
          if (values.loggedFor === "") delete values.loggedFor;
          this.setState({ formSubmitting: true });
          setTimeout(() => {
            axios
              .post(settings.apiUrl + "/tickets", values)
              .then((res) => {
                this.setState({ formSubmitting: false });
                resetForm();
                toast.success(res.data);
              })
              .catch((err) => {
                this.setState({ formSubmitting: false });
                //   toast.error(`${err.response.statusText} - ${err.response.data}`);
                toast.error(err.response.data);
              });
          }, 5000);
        }}
      >
        {(formik) => {
          const { errors, touched, isValid, dirty } = formik;
          return (
            <div>
              {this.state.error && <p>Error: {this.state.error}</p>}
              <div className="form-container">
                <h1>Create Ticket</h1>
                <Form>
                  <FormField
                    errors={errors}
                    touched={touched}
                    name="issue"
                    label="Issue"
                    as="textarea"
                    isSubmitting={this.state.formSubmitting}
                  />

                  <FormField
                    errors={errors}
                    touched={touched}
                    name="department"
                    label="Department"
                    isSubmitting={this.state.formSubmitting}
                  />

                  <FormField
                    errors={errors}
                    touched={touched}
                    name="loggedFor"
                    label="Logged on behalf of"
                    as="select"
                    isSubmitting={this.state.formSubmitting}
                  >
                    <option value="">Select a user</option>
                    {this.state.users.map((user) => (
                      <option value={user._id}>{user.email}</option>
                    ))}
                  </FormField>

                  <FormButton
                    title="Create Ticket"
                    dirty={dirty}
                    isValid={isValid}
                    isSubmitting={this.state.formSubmitting}
                  />
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
    ) : (
      <div>Loading...</div>
    );
  }
}

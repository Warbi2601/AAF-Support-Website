import React, { Component } from "react";
import axios from "axios";
import settings from "../settings/settings";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import "../styles/Form.scss";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";

const createTicketSchema = Yup.object().shape({
  issue: Yup.string().required().label("Issue"),
  //   loggedBy: Yup.string().required("Email is required"),
  loggedFor: Yup.string().required().length(24).label("Logged on behalf of"),
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
      });
    });
  }

  render() {
    return !this.state.loading ? (
      <Formik
        initialValues={initialValues}
        validationSchema={createTicketSchema}
        onSubmit={(values) => {
          console.log(values);
          axios.post(settings.apiUrl + "tickets", { ticket: values });
        }}
      >
        {(formik) => {
          const { errors, touched, isValid, dirty } = formik;
          return (
            <div className="form-container">
              <h1>Create Ticket</h1>
              <Form>
                <FormField
                  errors={errors}
                  touched={touched}
                  name="issue"
                  label="Issue"
                  as="textarea"
                />

                <FormField
                  errors={errors}
                  touched={touched}
                  name="department"
                  label="Department"
                />

                <FormField
                  errors={errors}
                  touched={touched}
                  name="loggedFor"
                  label="Logged on behalf of"
                  as="select"
                >
                  <option>Select a user</option>
                  {this.state.users.map((user) => (
                    <option value={user._id}>{user.email}</option>
                  ))}
                </FormField>

                <FormButton title="Create Ticket" dirty isValid />
              </Form>
            </div>
          );
        }}
      </Formik>
    ) : (
      <div>Loading...</div>
    );
  }
}

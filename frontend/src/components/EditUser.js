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

export default class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [
        { name: "Client", value: "client" },
        { name: "Support", value: "support" },
        { name: "Admin", value: "admin" },
      ],
    };
  }

  createTicketSchema = Yup.object().shape({
    role: Yup.string().label("Issue"),
    password: Yup.string().label("New Password"),
  });

  initialValues = {
    role: this.props.user.role,
    password: "",
  };

  onSubmit = async (values, { resetForm }) => {
    debugger;
    if (values.password === "") delete values.password;
    if (values.password.length < 6) {
      toast.error("Password needs to be minimum 6 characters");
      return;
    }
    trackPromise(
      axios
        .put(`${settings.apiUrl}/users/${this.props.user._id}`, values)
        .then((res) => {
          debugger;
          resetForm();
          toast.success(res.data.success);
          this.props.hideModal();
          // closeModal
        })
        .catch((err) => {
          debugger;
          toast.error(err.response.data.error);
        }),
      "edit-user-area"
    );
  };

  render() {
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.createTicketSchema}
        onSubmit={this.onSubmit}
      >
        {(formik) => {
          //   const { errors, touched, isValid, dirty, isSubmitting } = formik;
          return (
            <div>
              <div className="form-container">
                <Form>
                  <FormField
                    formik={formik}
                    name="role"
                    label="Role"
                    as="select"
                  >
                    {/* <option value="">Select a user</option> */}
                    {this.state.roles.map((role) => (
                      <option value={role.value}>{role.name}</option>
                    ))}
                  </FormField>

                  <FormField
                    formik={formik}
                    name="password"
                    label="New Password"
                    type="password"
                  />

                  <hr />

                  <FormButton title="Edit User" formik={formik} />
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
}

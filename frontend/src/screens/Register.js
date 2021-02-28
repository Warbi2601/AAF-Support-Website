import React, { Component } from "react";
import axios from "axios";
import settings from "../settings/settings";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import "../styles/Form.scss";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";

const registerSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().length(6).label("Password"),
  confirmPassword: Yup.string()
    .required()
    .length(6)
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .label("Confirm Password"),
  firstName: Yup.string().required().label("First Name"),
  lastName: Yup.string().required().label("Last Name"),
});

const initialValues = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
};

export default class Register extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit = async (values) => {
    await axios
      .post(settings.authUrl + "/register", values)
      .then((res) => {
        // resetForm();
        this.props.history.push("/");
        toast.success(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  render() {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={this.onSubmit}
      >
        {(formik) => {
          const { errors, touched, isValid, dirty, isSubmitting } = formik;
          console.log("FORMIK", formik);
          console.log("isSubmitting", isSubmitting);
          return (
            <div>
              <div className="form-container">
                <h1>Register</h1>
                <Form>
                  <FormField
                    formik={formik}
                    name="email"
                    label="Email"
                    inputType="email"
                  />

                  <FormField
                    formik={formik}
                    name="password"
                    label="Password"
                    inputType="password"
                  />

                  <FormField
                    formik={formik}
                    name="confirmPassword"
                    label="Confirm Password"
                    inputType="password"
                  />

                  <FormField
                    formik={formik}
                    name="firstName"
                    label="First Name"
                  />

                  <FormField
                    formik={formik}
                    name="lastName"
                    label="Last Name"
                  />

                  <FormButton title="Register" formik={formik} />
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
      // <form onSubmit={this.onSubmit}>
      //   <h1>Register</h1>
      //   <input
      //     type="email"
      //     name="email"
      //     placeholder="Enter email"
      //     value={this.state.email}
      //     onChange={this.handleInputChange}
      //     required
      //   />
      //   <input
      //     type="password"
      //     name="password"
      //     placeholder="Enter password"
      //     value={this.state.password}
      //     onChange={this.handleInputChange}
      //     required
      //   />
      //   <input type="submit" value="Submit" />
      // </form>
    );
  }
}

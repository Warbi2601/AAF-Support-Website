import React, { Component } from "react";
import axios from "axios";
import settings from "../settings/settings";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import "../styles/Form.scss";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";
import { Link } from "react-router-dom";
import LoadingIndicator from "../components/Loader/LoadingIndicator";
import { trackPromise } from "react-promise-tracker";
import { UserContext } from "../context/UserContext";

const registerSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  confirmPassword: Yup.string()
    .required()
    .min(6)
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
  static contextType = UserContext;

  constructor(props) {
    super(props);
  }

  onSubmit = async (values) => {
    trackPromise(
      axios
        .post(settings.authUrl + "/register", values)
        .then((res) => {
          this.context.setUser(res.data.user);
          this.props.history.push("/");
          toast.success(res.data.success);
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        }),
      "register-area"
    );
  };

  render() {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={this.onSubmit}
      >
        {(formik) => {
          // const { errors, touched, isValid, dirty, isSubmitting } = formik;
          return (
            <div className="login-spacing">
              <div className="login-container">
                <div className="form-container">
                  <h1>Register</h1>
                  <Form>
                    <FormField
                      formik={formik}
                      name="email"
                      label="Email"
                      type="email"
                    />

                    <FormField
                      formik={formik}
                      name="password"
                      label="Password"
                      type="password"
                    />

                    <FormField
                      formik={formik}
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
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
                    <p className="forgot-password text-right">
                      Already got an account? <Link to={"/login"}>Login</Link>
                    </p>
                  </Form>
                </div>
                <LoadingIndicator area="register-area" />
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
}

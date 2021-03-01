import React, { Component } from "react";
import axios from "axios";
import settings from "../settings/settings";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { trackPromise } from "react-promise-tracker";
import { Link } from "react-router-dom";

import "../styles/Form.scss";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";
import { UserContext } from "../context/UserContext";
import LoadingIndicator from "../components/Loader/LoadingIndicator";

const loginSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().label("Password"),
});

const initialValues = {
  email: "",
  password: "",
};

export default class Login extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  onSubmit = async (values) => {
    trackPromise(
      axios
        .post(settings.authUrl + "/login", values)
        .then((res) => {
          this.context.setUser(res.data);
          this.props.history.push("/");
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response.data.error);
        }),
      "login-area"
    );
  };

  render() {
    return (
      <div className="login-form">
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={this.onSubmit}
        >
          {(formik) => {
            const { errors, touched, isValid, dirty, isSubmitting } = formik;
            return (
              <div>
                <div className="form-container">
                  <h1>Login</h1>
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

                    <FormButton title="Login" formik={formik} />
                    <p className="forgot-password text-right">
                      Not got an account? <Link to={"/register"}>Sign up</Link>
                    </p>
                  </Form>
                </div>
                <LoadingIndicator area="login-area" />
              </div>
            );
          }}
        </Formik>
      </div>
    );
  }
}

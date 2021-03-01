import React, { Component } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import "../styles/Form.scss";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";

const updateInfoSchema = Yup.object().shape({
  issue: Yup.string().required().label("Issue"),
});

const initialValues = {
  issue: "",
};

export default class CreateTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={updateInfoSchema}
        onSubmit={this.props.onSubmit}
      >
        {(formik) => {
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

                  <hr />

                  <FormButton title="Update Information" formik={formik} />
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
}

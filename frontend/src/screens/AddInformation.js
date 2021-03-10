import React, { Component } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import "../styles/Form.scss";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";

export default class AddInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const updateInfoSchema = Yup.object().shape({
      moreInfo: Yup.string().required().label("More Information"),
      action: Yup.number().required(),
    });

    const initialValues = {
      moreInfo: "",
      action: this.props.action,
    };

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
                    name="moreInfo"
                    label="More Information"
                    as="textarea"
                  />
                  <FormField
                    formik={formik}
                    value={this.props.action}
                    name="action"
                    hidden
                  />
                  <hr />
                  <FormButton title="Add More Information" formik={formik} />
                </Form>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
}

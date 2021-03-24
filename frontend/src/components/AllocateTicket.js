import React, { Component } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import "../styles/Form.scss";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";

const AllocateTicket = ({
  action,
  currentAllocatedToID,
  onSubmit,
  isReallocate = false,
}) => {
  const allocateTicketSchema = Yup.object().shape({
    allocatedTo: Yup.string().required().label("Allocated To"),
    action: Yup.number().required(),
  });

  const initialValues = {
    allocatedTo: currentAllocatedToID || "",
    action: action,
  };

  const label = isReallocate ? "Reallocate To" : "Allocate To";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={allocateTicketSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div>
            <div className="form-container">
              <Form>
                <FormField
                  formik={formik}
                  name="allocatedTo"
                  label={label}
                  as="select"
                >
                  <option value="">Select a support agent</option>
                  {users &&
                    users.map((user) =>
                      user.role === "support" ? (
                        <option value={user._id}>{user.email}</option>
                      ) : null
                    )}
                </FormField>
                <FormField
                  formik={formik}
                  value={this.props.action}
                  name="action"
                  hidden
                />
                <hr />
                <FormButton title={label} formik={formik} />
              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default AllocateTicket;

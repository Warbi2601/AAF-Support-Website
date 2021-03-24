import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

import "../styles/Form.scss";
import settings from "../settings/settings";
import FormField from "../components/forms/FormField";
import FormButton from "../components/forms/FormButton";

const AllocateTicket = ({
  action,
  currentAssignedToID,
  onSubmit,
  isReallocate = false,
}) => {
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    axios
      .get(settings.apiUrl + "/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const label = isReallocate ? "Reallocate To" : "Allocate To";

  const allocateTicketSchema = Yup.object().shape({
    assignedTo: Yup.string().required().label(label),
    action: Yup.number().required(),
  });

  const initialValues = {
    assignedTo: currentAssignedToID || "",
    action: action,
  };

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
                  name="assignedTo"
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
                  // value={action}
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

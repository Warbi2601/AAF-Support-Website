import React from "react";
import { Field, ErrorMessage } from "formik";

function FormField({
  errors,
  touched,
  name,
  label = name,
  as = "input",
  children,
}) {
  //   console.log("EERORS" + name, errors);
  //   console.log("TOUCHED" + name, touched);
  return (
    <div className="form-row">
      <label htmlFor={name}>{label}</label>
      <Field
        as={as}
        name={name}
        id={name}
        className={errors[name] && touched[name] ? "input-error" : null}
      >
        {children}
      </Field>
      <ErrorMessage name={name} component="span" className="error" />
    </div>
  );
}

export default FormField;

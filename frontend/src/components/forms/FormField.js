import React from "react";
import { Field, ErrorMessage } from "formik";

function FormField({
  // errors,
  // touched,
  formik,
  name,
  children,
  label = name,
  as = "input",
  // isSubmitting = false,
  disabled = false,
  ...otherProps
}) {
  return (
    <div className="form-row">
      {!otherProps.hidden && <label htmlFor={name}>{label}</label>}
      <Field
        as={as}
        name={name}
        id={name}
        className={
          formik.errors[name] && formik.touched[name] ? "input-error" : null
        }
        disabled={formik.isSubmitting || disabled}
        placeholder={label || ""}
        // value={"support"}
        {...otherProps}
      >
        {children}
      </Field>
      <ErrorMessage name={name} component="span" className="error" />
    </div>
  );
}

export default FormField;

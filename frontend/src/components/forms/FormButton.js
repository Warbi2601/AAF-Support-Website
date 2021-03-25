import React from "react";

function FormButton({ title, formik, children }) {
  return (
    <button
      type="submit"
      className={
        !(formik.dirty && formik.isValid) || formik.isSubmitting
          ? "disabled-btn"
          : ""
      }
      disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
    >
      {children}
      {title}
    </button>
  );
}

export default FormButton;

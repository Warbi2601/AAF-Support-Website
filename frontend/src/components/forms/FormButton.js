import React from "react";

function FormButton({ title, formik }) {
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
      {title}
    </button>
  );
}

export default FormButton;

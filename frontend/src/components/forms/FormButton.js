import React from "react";

function FormButton({ title, dirty, isValid, isSubmitting = false }) {
  return (
    <button
      type="submit"
      className={!(dirty && isValid) || isSubmitting ? "disabled-btn" : ""}
      disabled={!(dirty && isValid) || isSubmitting}
    >
      {title}
    </button>
  );
}

export default FormButton;

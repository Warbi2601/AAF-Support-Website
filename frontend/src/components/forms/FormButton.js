import React from "react";

function FormButton({ title, dirty, isValid }) {
  return (
    <button
      type="submit"
      className={!(dirty && isValid) ? "disabled-btn" : ""}
      disabled={!(dirty && isValid)}
    >
      {title}
    </button>
  );
}

export default FormButton;

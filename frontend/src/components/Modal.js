import React, { useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingIndicator from "./Loader/LoadingIndicator";

function Modal({
  backdrop = "static",
  keyboard = false,
  show = false,
  onHide,
  title,
  BodyComponent,
  FooterComponent,
  loaderName,
}) {
  return (
    <BootstrapModal
      show={show}
      onHide={onHide}
      backdrop={backdrop}
      keyboard={keyboard}
    >
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        {BodyComponent && <BodyComponent />}

        <div data-testid="modal"></div>
        {/* <p>Bod</p> */}
      </BootstrapModal.Body>
      {/* <BootstrapModal.Footer>
        <FooterComponent />
      </BootstrapModal.Footer> */}
      <LoadingIndicator area={loaderName} />
    </BootstrapModal>
  );
}

export default Modal;

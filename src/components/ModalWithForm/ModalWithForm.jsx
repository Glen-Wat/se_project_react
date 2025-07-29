import "./ModalWithForm.css";
import React, { useEffect } from "react";

function ModalWithForm({
  children,
  buttonText,
  title,
  isOpen,
  onClose,
  onSubmit,
  action,
}) {
  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""} `}>
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <button
          onClick={onClose}
          type="button"
          className="modal__close"
        ></button>
        <form onSubmit={onSubmit} className="modal__form">
          {children}
          <div className="modal__actions">
            <button className="modal__submit">{buttonText}</button>
            {action}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;

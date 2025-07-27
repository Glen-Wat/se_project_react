import "./DeleteConfirmationModal.css";
import closeIcon from "../../assets/modal-close.svg";

function DeleteConfirmationModal({ isOpen, onClose, onCardDelete, itemName }) {
  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="delete__modal-overlay" onClick={onClose}>
        <div className="delete__modal-container">
          <div className="delete__modal-content">
            <button
              className="delete__modal-close"
              type="button"
              onClick={onClose}
            >
              <img src={closeIcon} alt="Close modal" />
            </button>
            <div className="delete__warning-container">
              <p className="delete__modal-warning">
                Are you sure you want to delete this item?
              </p>
              <p className="delete__modal-warning">
                <strong>{itemName}</strong> will be deleted
              </p>
            </div>
            <div className="delete__modal-actions">
              <button
                className="modal__button delete__modal_button_cancel"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="modal__button delete__modal_button_confirm"
                type="button"
                onClick={onCardDelete}
              >
                Yes, delete item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;

import "./ItemModal.css";

function ItemModal({ activeModal, onClose, card, handleDeleteCard }) {
  return (
    <div
      className={`modal ${activeModal === "preview" ? "modal_opened" : ""} `}
    >
      <div className="modal__content_type_image">
        <button
          onClick={onClose}
          type="button"
          className="modal__close modal__close_type-item"
        ></button>
        <img src={card.imageUrl} alt="modal-images" className="modal__image" />
        <div className="modal__footer">
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather: {card.weather}</p>

          <button
            className="modal-close modal__delete-item_btn"
            type="button"
            onClick={() => handleDeleteCard(card._id)}
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;

import "./ItemModal.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemModal({ activeModal, onClose, card, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = Boolean(
    currentUser?._id &&
      (card?.owner === currentUser._id ||
        card?.owner?._id === currentUser._id ||
        !card?.owner)
  );

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
        <img
          src={card.imageUrl || card.link}
          alt="modal-images"
          className="modal__image"
        />
        <div className="modal__footer">
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather: {card.weather}</p>
          {isOwn && (
            <button
              className="modal-close modal__delete-item_btn"
              type="button"
              onClick={() => onCardDelete(card._id)}
            >
              Delete Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemModal;

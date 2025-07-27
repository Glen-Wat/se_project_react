import "./ItemCard.css";
import React, { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import likeIcon from "../../assets/like-icon.svg";

function ItemCard({ item, onCardClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);
  const isLiked = (item.likes || []).some((id) => id === currentUser._id);
  const itemLikeButtonClassName = `item__like-button ${
    isLiked ? "item__like-button_active" : ""
  }`;
  const handleCardClick = () => {
    onCardClick(item);
  };

  const handleLike = () => {
    onCardLike({ id: item._id, isLiked });
  };

  return (
    <li className="card">
      <h2 className="card__name">{item.name}</h2>
      <img
        onClick={handleCardClick}
        className="card__image"
        src={item.imageUrl || item.link}
        alt={item.name}
      />

      <button
        className={itemLikeButtonClassName}
        onClick={handleLike}
        aria-label="Like"
      >
        <img src={likeIcon} alt="Heart Icon" />
      </button>
    </li>
  );
}

export default ItemCard;

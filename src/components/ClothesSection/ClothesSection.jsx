import "./ClothesSection.css";
import React, { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import ItemCard from "../ItemCard/ItemCard";

function ClothesSection({ clothingItems, onCardClick, isOpen, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  const userCards = clothingItems.filter(
    (item) => currentUser._id && item.owner === currentUser._id
  );

  return (
    <div className="clothes-section">
      <div className="clothes-section__content">
        <p className="clothes-section__text">Your items</p>
        <button
          className="clothes-section__add-btn"
          type="button"
          onClick={isOpen}
        >
          + Add New
        </button>
      </div>
      <ul className="clothes-section__items">
        {userCards.map((item) => {
          return (
            <ItemCard
              key={item._id}
              item={item}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default ClothesSection;

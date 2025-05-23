import "./ClothesSection.css";

import ItemCard from "../ItemCard/ItemCard";

function ClothesSection({ clothingItems, onCardClick, isOpen }) {
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
        {clothingItems?.map((item) => {
          return (
            <ItemCard key={item._id} item={item} onCardClick={onCardClick} />
          );
        })}
      </ul>
    </div>
  );
}

export default ClothesSection;

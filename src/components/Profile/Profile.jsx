import ClothesSection from "../ClothesSection/ClothesSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Profile({
  onCardClick,
  isOpen,
  clothingItems,
  handleLogout,
  onCardLike,
  onEditProfile,
}) {
  const currentUser = useContext(CurrentUserContext);
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar
          avatar={currentUser?.avatar}
          name={currentUser?.name}
          onEditProfile={onEditProfile}
          handleLogout={handleLogout}
        />
      </section>

      <section className="profile__clothing-items">
        <ClothesSection
          onCardClick={onCardClick}
          isOpen={isOpen}
          clothingItems={clothingItems}
          onCardLike={onCardLike}
        />
      </section>
    </div>
  );
}

export default Profile;

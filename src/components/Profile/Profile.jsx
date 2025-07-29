import ClothesSection from "../ClothesSection/ClothesSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";

function Profile({
  currentUser,

  onCardClick,
  isOpen,
  clothingItems,
  handleLogout,
  onCardLike,
  onEditProfile,
}) {
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

import "./SideBar.css";
import avatar from "../../assets/avatar.png";

function SideBar({ avatar, name, onEditProfile, handleLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar__user-container">
        {avatar && avatar.trim() !== "" ? (
          <img
            className="sidebar__avatar"
            src={avatar}
            alt={`profile avatar for ${name}`}
          />
        ) : (
          <div className="sidebar__avatar-placeholder">
            {name?.charAt(0).toUpperCase() || ""}
          </div>
        )}
        <p className="sidebar__username">{name}</p>
      </div>
      <button className="sidebar__edit-btn" onClick={onEditProfile}>
        Change profile info
      </button>
      <button className="sidebar__logout-btn" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}

export default SideBar;

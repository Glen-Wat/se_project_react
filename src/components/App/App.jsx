import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import ItemModal from "../ItemModal/ItemModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import AddItemModal from "../AddItemModal/AddItemModal";
import { defaultClothingItems } from "../../utils/constants";
import { getItems } from "../../utils/api";
import { deleteCard } from "../../utils/api";
import { addItem } from "../../utils/api";

import { signup, signin, updateProfile, checkToken } from "../../utils/auth";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { addCardLike, removeCardLike } from "../../utils/api";

function App() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
    isDay: false,
  });
  const [clothingItems, setClothingItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [cardToDelete, setCardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isItemsLoading, setIsItemsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditprofileOpen, setIsEditProfileOpen] = useState("");
  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    if (!isLoggedIn) return;
    setActiveModal("add-garment");
  };

  const closeModal = () => {
    setActiveModal("");
  };

  const handleLogin = useCallback(
    async ({ email, password }) => {
      try {
        const data = await signin({ email, password });

        if (!data.token || !data.user) {
          throw new Error("No token or user received");
        }

        const { token, user } = data;

        localStorage.setItem("jwt", token);
        setCurrentUser(user);
        setIsLoggedIn(true);

        setIsItemsLoading(true);

        const userItems = await getItems(token);
        setClothingItems(
          userItems.length > 0 ? userItems : defaultClothingItems
        );

        setIsItemsLoading(false);

        closeModal();
        navigate("/profile");
      } catch (err) {
        console.error("Login error:", err);
        setIsLoggedIn(false);
        setCurrentUser(null);
        setClothingItems(defaultClothingItems);
        setIsItemsLoading(false);
      }
    },
    [navigate]
  );

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserItems([]);
    setClothingItems(defaultClothingItems);
    closeModal();
  };

  const handleDeleteCard = (cardId) => {
    setCardToDelete(cardId);
    setActiveModal("delete-confirmation");
  };

  const handleConfirmDelete = () => {
    const token = localStorage.getItem("jwt");
    deleteCard(cardToDelete, token)
      .then(() => {
        setClothingItems((prevItems) =>
          prevItems.filter((item) => item._id !== cardToDelete)
        );
        closeModal();
      })
      .catch(console.error);
  };

  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    const token = localStorage.getItem("jwt");
    setIsLoading(true);

    addItem({ name, imageUrl, weather }, token)
      .then((newItem) => {
        setClothingItems((prevItems) => [newItem, ...prevItems]);
        closeModal();
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRegisterModal = () => {
    setActiveModal("register");
  };

  const handleRegistration = (userData) => {
    signup(userData)
      .then(() => {
        closeModal();
        return handleLogin({
          email: userData.email,
          password: userData.password,
        });
      })
      .then(() => {
        navigate("/profile");
      })
      .catch(console.error);
  };

  const handleEditProfileModal = () => {
    setIsEditProfileOpen(true);
  };

  const handleEditProfileSubmit = ({ name, avatar }) => {
    const token = localStorage.getItem("jwt");
    updateProfile({
      name,
      avatar:
        avatar ||
        "https://practicum-content.s3.us-west-1.amazonaws.com/avatars/default-avatar.png",
      token,
    })
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        setIsEditProfileOpen(false);
      })
      .catch(console.error);
  };

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");
    const likeAction = !isLiked
      ? addCardLike(id, token)
      : removeCardLike(id, token);

    likeAction
      .then((updatedCard) => {
        if (!updatedCard || !updatedCard._id) {
          console.error("Invalid card returned:", updatedCard);
          return;
        }
        const correctedCard = {
          ...updatedCard,
          likes: [...updatedCard.likes],
        };
        setClothingItems((cards) =>
          cards.map((item) =>
            item._id === updatedCard._id ? correctedCard : item
          )
        );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((items) => {
        const normalized = items.map((item) => ({
          ...item,
          link: item.link || item.imageUrl || item.image, // normalize for frontend
        }));
        setClothingItems(normalized);
      })
      .catch(console.error);
  }, []);

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      checkToken({ token })
        .then((user) => {
          setIsLoggedIn(true);
          setCurrentUser(user);
          setIsAuthChecked(true);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setCurrentUser({});
          localStorage.removeItem("jwt");
          setIsAuthChecked(true);
        });
    } else {
      setIsLoggedIn(false);
      setCurrentUser({});
      setIsAuthChecked(true);
    }
  }, [isLoggedIn]);
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <div className="page__content">
            {isAuthChecked && (
              <>
                <Header
                  handleAddClick={handleAddClick}
                  weatherData={weatherData}
                  handleLogin={() => setActiveModal("login")}
                  handleRegisterModal={() => setActiveModal("register")}
                  isLoggedIn={isLoggedIn}
                />
                <div className="page__main">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Main
                          weatherData={weatherData}
                          onCardClick={handleCardClick}
                          clothingItems={clothingItems}
                          handleAddClick={handleAddClick}
                          onCardLike={handleCardLike}
                          isLoggedIn={isLoggedIn}
                        />
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                          {isAuthChecked ? (
                            <Profile
                              clothingItems={clothingItems}
                              onCardClick={handleCardClick}
                              isOpen={handleAddClick}
                              onEditProfile={handleEditProfileModal}
                              onCardLike={handleCardLike}
                              handleLogout={handleLogout}
                              isLoggedIn={isLoggedIn}
                            />
                          ) : (
                            <div>Loading...</div>
                          )}
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </div>
              </>
            )}
          </div>
          <Footer />
        </div>

        <AddItemModal
          isOpen={activeModal === "add-garment"}
          onClose={closeModal}
          onAddModalSubmit={handleAddItemModalSubmit}
        />
        <ItemModal
          activeModal={activeModal}
          card={selectedCard}
          onClose={closeModal}
          onCardDelete={handleDeleteCard}
        />
        <DeleteConfirmationModal
          isOpen={activeModal === "delete-confirmation"}
          onClose={closeModal}
          onCardDelete={handleConfirmDelete}
        />
        <RegisterModal
          isOpen={activeModal === "register"}
          onClose={closeModal}
          onRegister={handleRegistration}
          onSwitchToLogin={() => setActiveModal("login")}
        />
        <LoginModal
          isOpen={activeModal === "login"}
          onClose={closeModal}
          onLogin={handleLogin}
          onSwitchToRegister={() => setActiveModal("register")}
        />
        <EditProfileModal
          isOpen={isEditprofileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onUpdateUser={handleEditProfileSubmit}
        />
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;

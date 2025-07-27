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
  const [clothingItems, setClothingItems] = useState(defaultClothingItems);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [cardToDelete, setCardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogin = useCallback(({ email, password }) => {
    return signin({ email, password }).then((data) => {
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        setIsLoggedIn(true);
        setActiveModal("");
        navigate("/profile");
      } else {
        return Promise.reject();
      }
    });
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser({});
    setActiveModal("");
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
        setClothingItems((prevItems) => [newItem.data, ...prevItems]);
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
        setActiveModal("");
        handleLogin({ email: userData.email, password: userData.password });
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
        const correctedCard = {
          ...updatedCard,
          likes: updatedCard.likes[0], // Take the first element to flatten it
        };
        setClothingItems((cards) =>
          cards.map((item) => (item._id === id ? correctedCard : item))
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
      .then((data) => {
        console.log(data);
        setClothingItems(data);
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
  }, []);

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
                  currentUser={currentUser}
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
                        />
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                          {isAuthChecked ? (
                            <Profile
                              currentUser={currentUser}
                              onCardClick={handleCardClick}
                              clothingItems={clothingItems}
                              isOpen={handleAddClick}
                              onEditProfile={handleEditProfileModal}
                              onCardLike={handleCardLike}
                              handleLogout={handleLogout}
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
          currentUser={currentUser}
        />
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;

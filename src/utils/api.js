const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.projwtwr.ignorelist.com"
    : "http://localhost:3001";

export function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }

  return res.json().then((err) => {
    console.error("Backend validation error:", err);
    return Promise.reject(err.message || `Error: ${res.status}`);
  });
}
function getProtectedData(token) {
  return fetch(`${BASE_URL}/protected-endpoint`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
}

function request(url, options = {}) {
  return fetch(url, options).then(checkResponse);
}

const getItems = () => {
  return request(`${BASE_URL}/items`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function addItem({ name, weather, imageUrl }, token) {
  return request(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      imageUrl,
      weather,
    }),
  });
}

function deleteCard(id, token) {
  return fetch(`${BASE_URL}/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  });
}

const addCardLike = (id, token) => {
  return fetch(`${BASE_URL}/items/${id}/likes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};

const removeCardLike = (id, token) => {
  return fetch(`${BASE_URL}/items/${id}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(checkResponse);
};

export {
  getItems,
  deleteCard,
  addItem,
  getProtectedData,
  addCardLike,
  removeCardLike,
};

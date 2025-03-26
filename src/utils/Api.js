class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => res.json());
  }

  // insert other methods for working with the API //
}

export default Api;

// API Endpoints that need to be included
// User Routes
// GET /users/me - Get the current user's info
// PATCH /users/me - Update your profile information
// PATCH /users/me/avatar - Update avatar

// Card Routes
// GET /cards - Get all cards
// POST /cards - Create a card
// DELETE /cards/:cardID - Delete a card
// PUT /cards/:cardID/likes - Like a card
// DELETE /cards/:cardID/likes - Dislike a card

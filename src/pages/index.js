import "./index.css";

import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "69c62aef-e427-4385-92d1-bf15409393cc",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      renderCard(item, "append");
    });
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
  })

  .catch((err) => {
    console.error(err);
  });

//variables for editing profile//
const profileEditButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector("#edit-modal");
const editModalCloseButton = editModal.querySelector(".modal__button-close");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__subtitle");
const inputName = editModal.querySelector("#profile-name-input");
const inputDescription = editModal.querySelector("#profile-desc-input");
const editFormElement = editModal.querySelector(".modal__container");
const profileAvatar = document.querySelector(".profile__avatar");

//variables for cards, card elements, and template//
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//variables for adding cards modal//
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__button-close");
const cardModalNewPost = document.querySelector(".profile__add-button");
const cardForm = document.forms["add-card-form"];
const cardNameInput = cardModal.querySelector("#add-link-input");
const cardCaptionInput = cardModal.querySelector("#add-caption-input");
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(
  ".modal__button-close_preview"
);
const cardSubmitBtn = cardModal.querySelector(".modal__button-submit");

//variables for deleting cards modal//
const deleteModal = document.querySelector("#delete-modal");
const deleteButton = document.querySelector(".modal__button-delete");
const cancelButton = document.querySelector(".modal__button-cancel");
const deleteCloseButton = document.querySelector(".modal__button-close-delete");
let selectedCard;
let selectedCardId;

//closing modals with overlay click//
function handleModalOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

//closing modals with esc keydown//
function handleEscKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

//functions to open and close modals//
function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", handleModalOverlay);
  document.addEventListener("keydown", handleEscKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", handleModalOverlay);
  document.removeEventListener("keydown", handleEscKey);
}

//function to submit edits to the profile//
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({ name: inputName.value, about: inputDescription.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error);
}

//functions for cards template, like button, and delete button//
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameElement = cardElement.querySelector(".card__title");
  cardNameElement.textContent = data.name;
  const cardImageElement = cardElement.querySelector(".card__image");
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  const cardLikeButton = cardElement.querySelector(".card__like-button");
  cardLikeButton.addEventListener("click", () => {
    if (cardLikeButton.classList.contains("card__like-button_clicked")) {
      api
        .dislikeCard(data._id)
        .then(() => {
          cardLikeButton.classList.toggle("card__like-button_clicked");
        })
        .catch(console.error);
    } else {
      api
        .likeCard(data._id)
        .then(() => {
          cardLikeButton.classList.toggle("card__like-button_clicked");
        })
        .catch(console.error);
    }
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  cardDeleteBtn.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data)
  );

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  return cardElement;
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

//function to add cards to the profile//
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  api
    .addNewCard({ name: cardCaptionInput.value, link: cardNameInput.value })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error);
}

//function to delete cards from the profile//
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteCardSubmit() {
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error);
}

deleteCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

//function to close modals//
previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

//opening and closing edit modal with click//
profileEditButton.addEventListener("click", () => {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  resetValidation(editFormElement, [inputName, inputDescription], settings);
  openModal(editModal);
});

editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

//opening and closing add card with click//
cardModalNewPost.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

//submit button for editing profile//
editFormElement.addEventListener("submit", handleEditFormSubmit);

//submit button for saving a card//
cardForm.addEventListener("submit", handleAddCardSubmit);

// delete and cancel buttons on delete modal //
deleteButton.addEventListener("click", handleDeleteCardSubmit);
cancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

//call validation from imports//
enableValidation(settings);

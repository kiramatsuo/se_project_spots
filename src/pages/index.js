import "./index.css";

import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant Terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An Outdoor Cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

//variables for editing profile//
const profileEditButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector("#edit-modal");
const editModalCloseButton = editModal.querySelector(".modal__button-close");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__subtitle");
const inputName = editModal.querySelector("#profile-name-input");
const inputDescription = editModal.querySelector("#profile-desc-input");
const editFormElement = editModal.querySelector(".modal__container");

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
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closeModal(editModal);
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
    cardLikeButton.classList.toggle("card__like-button_clicked");
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

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

initialCards.forEach((item) => {
  renderCard(item, "append");
});

//function to add cards to the profile//
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: cardCaptionInput.value,
    link: cardNameInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  evt.target.reset();
  disableButton(cardSubmitBtn, settings);
  closeModal(cardModal);
}

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

//call validation from imports//
enableValidation(settings);

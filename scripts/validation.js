const formElement = document.querySelector(".modal");
const formInput = formElement.querySelector(".modal__input");
const formErrorMessage = formElement.querySelector(formInput.id + "-error");

const showInputError = (formElement, inputElement, formErrorMessage) => {
  inputElement.classList.add("modal__error");
  formInput.textContent = formErrorMessage;
};

const hideInputError = (formElement, inputElement) => {
  inputElement.classList.remove("modal__error");
  formErrorMessage.textContent = "";
};

const checkInputValidity = (formElement, inputElement) => {
  if (!formInput.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

formElement.addEventListener("submit", function (evt) {
  evt.preventDefault();
});

formInput.addEventListener("input", checkInputValidity);

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
  const buttonElement = formElement.querySelector(".modal__button-submit");
  //TODO - handle initial states
  //toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      //toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll(".modal__form"));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement);
  });
};

enableValidation();

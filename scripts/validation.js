const formElement = document.querySelector(".modal__form");
const formInput = formElement.querySelector(".modal__input");
const buttonElement = formElement.querySelector(".modal__button-submit");

const showInputError = (formElement, inputElement, { formErrorMessage }) => {
  const errorMsgElement = formElement.querySelector(
    `.#${inputElement.id}-error`
  );
  errorMsgElement.textContent = formErrorMessage;
  inputElement.classList.add("modal__error");
};

const hideInputError = (formElement, inputElement) => {
  const errorMsgElement = formElement.querySelector(
    `.#${inputElement.id}-error`
  );
  formErrorMessage.textContent = "";
  inputElement.classList.remove("modal__error");
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

formElement.addEventListener("submit", function (evt) {
  evt.preventDefault();
});

formInput.addEventListener("input", checkInputValidity);

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add("modal__button-submit_disabled");
  } else {
    buttonElement.classList.remove("modal__button-submit_disabled");
  }
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
  const buttonElement = formElement.querySelector(".modal__button-submit");

  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

enableValidation();

import "./index.css";
import {
  resetValidation,
  enableValidation,
  disableButton,
  validationConfig,
} from "../scripts/validate.js";

import logoSrc from "../images/icons/logo.svg";
import editIconSrc from "../images/icons/edit-icon.svg";
import plusIconSrc from "../images/icons/plus.svg";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "6e58b2db-8c6b-4765-b44f-89c77c553815",
    "Content-Type": "application/json",
  },
});

const userProfileName = document.querySelector(".profile__name");
const userProfileAbout = document.querySelector(".profile__description");
const userProfileAvatar = document.querySelector(".profile__avatar");

//image imports
const spotsLogo = document.getElementById("spots-logo");
spotsLogo.src = logoSrc;

const editIcon = document.getElementById("edit-icon");
editIcon.src = editIconSrc;

const plusIcon = document.getElementById("plus-icon");
plusIcon.src = plusIconSrc;

const editProfileBtn = document.querySelector(".profile__edit-profile-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
// const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = document.forms.profile;

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
// const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = document.forms.newPost;

const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteCardBtn = document.querySelector(".modal__delete-btn");
const cancelDeleteCardBtn = document.querySelector(".modal__cancel-btn");

const editAvatarBtn = document.querySelector(".profile__avatar-edit-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = document.forms.avatar;
const avatarLinkInput = document.querySelector("#avatar-link-input");

// get profile name and description
const profileInformation = document.querySelector(".profile__column");
const profileName = profileInformation.querySelector(".profile__name");
const profileDescription = profileInformation.querySelector(
  ".profile__description"
);

// get input elements from the modals
const profileNameInput = editProfileModal.querySelector("#profile-name-input");
const profileDescriptionInput =
  editProfileModal.querySelector("#describe-input");

const imageLinkInput = newPostModal.querySelector("#image-link-input");
const captionInput = newPostModal.querySelector("#caption-input");

const cardContainer = document.querySelector(".cards__list");

//modal preview elements
const modalImage = document.querySelector("#modal-image");
const modalImagePreview = modalImage.querySelector(".modal__image");
const caption = modalImage.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template").content;

const modals = document.querySelectorAll(".modal");

let selectedCard;
let selectedCardId;

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    closeModal(openModal);
  }
}

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (
      evt.target === modal ||
      evt.target.classList.contains("modal__close-btn")
    ) {
      closeModal(modal);
    }
  });
});

function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__text");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.setAttribute("src", data.link);
  cardImage.setAttribute("alt", data.name);
  cardTitle.textContent = data.name;

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  if (data.isLiked) {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  }
  cardLikeBtn.addEventListener("click", (evt) => {
    handleLikeCard(evt.target, data._id, data.isLiked);
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtn.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImage.addEventListener("click", () => {
    modalImagePreview.setAttribute("src", data.link);
    modalImagePreview.setAttribute("alt", data.name);
    caption.textContent = data.name;
    openModal(modalImage);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}

editAvatarBtn.addEventListener("click", () => {
  openModal(editAvatarModal);
});

editProfileBtn.addEventListener("click", function () {
  openModal(editProfileModal);
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editProfileForm,
    [profileNameInput, profileDescriptionInput],
    validationConfig
  );
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const name = profileNameInput.value;
  const about = profileDescriptionInput.value;
  evt.submitter.textContent = "Saving...";
  evt.submitter.disabled = true;
  api
    .editUserInfo({ name, about })
    .then((res) => {
      userProfileName.textContent = res.name;
      userProfileAbout.textContent = res.about;
      closeModal(editProfileModal);
    })
    .catch((err) => handleError(err, evt))
    .finally(() => handleFinally(evt));
});

cancelDeleteCardBtn.addEventListener("click", () => {
  closeModal(deleteCardModal);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const name = captionInput.value;
  const link = imageLinkInput.value;
  evt.submitter.textContent = "Saving...";
  evt.submitter.disabled = true;
  api
    .addCard({ name, link })
    .then((res) => {
      renderCard(res);
      newPostForm.reset();
      closeModal(newPostModal);
    })
    .catch((err) => handleError(err, evt))
    .finally(() => handleFinally(evt));
});

deleteCardBtn.addEventListener("click", handleDeleteSubmit);

editAvatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const link = avatarLinkInput.value;
  evt.submitter.textContent = "Saving...";
  evt.submitter.disabled = true;
  api
    .editUserAvatar(link)
    .then((res) => {
      userProfileAvatar.src = res.avatar;
      closeModal(editAvatarModal);
      editAvatarForm.reset();
    })
    .catch((err) => handleError(err, evt))
    .finally(() => handleFinally(evt));
});

// The function accepts a card object and a method of adding to the section
// The method is initially `prepend`, but you can pass `append`
function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  // Add the card into the section using the method
  cardContainer[method](cardElement);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteCardModal);
}

function handleLikeCard(likeBtn, cardId, cardIsLiked) {
  if (!cardIsLiked) {
    api
      .likeCard(cardId)
      .then(() => likeBtn.classList.toggle("card__like-btn_liked"))
      .catch((err) => console.error(err));
  } else {
    api
      .dislikeCard(cardId)
      .then(() => likeBtn.classList.toggle("card__like-btn_liked"))
      .catch((err) => console.error(err));
  }
}

function handleDeleteSubmit() {
  deleteCardBtn.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      deleteCardBtn.textContent = "Delete";
    });
}

// Ensures user information  and cards are loaded on startup
function startUpSpots() {
  api
    .spotsStartUp()
    .then((results) => {
      const [cardsData, userInfo] = results; // destructuring the array

      // Now you can use each piece of data:
      // cardsData contains the cards from the server
      // userInfo contains the user information

      // Process user info first
      // Update profile name, about, avatar, etc.
      userProfileName.textContent = userInfo.name;
      userProfileAbout.textContent = userInfo.about;
      userProfileAvatar.src = userInfo.avatar;
      // Then render the cards
      // Create and display the cards on the page
      cardsData.forEach((card) => renderCard(card, "append"));
    })
    .catch((err) => {
      console.error(err); // Handle any errors
    });
}

function handleError(err, evt) {
  console.log(error);
  evt.submitter.disabled = false;
}

function handleFinally(evt) {
  evt.submitter.textContent = "Save";
  disableButton(evt.submitter, validationConfig);
}

enableValidation(validationConfig);
startUpSpots();

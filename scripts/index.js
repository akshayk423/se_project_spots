const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
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
];

const editProfileBtn = document.querySelector(".profile__edit-profile-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
// const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = document.forms.profile;
const editProfileFormSubmitBtn =
  editProfileForm.querySelector(".modal__submit");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
// const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = document.forms.newPost;
const newPostFormSubmitBtn = newPostForm.querySelector(".modal__submit");

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
  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
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

editProfileBtn.addEventListener("click", function () {
  openModal(editProfileModal);
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editProfileForm,
    [profileNameInput, profileDescriptionInput],
    settings
  );
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileName.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(editProfileModal);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const data = {
    name: captionInput.value,
    link: imageLinkInput.value,
  };
  renderCard(data);
  newPostForm.reset();
  disableButton(newPostFormSubmitBtn, settings);
  closeModal(newPostModal);
});

initialCards.forEach((card) => {
  renderCard(card);
});

// The function accepts a card object and a method of adding to the section
// The method is initially `prepend`, but you can pass `append`
function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  // Add the card into the section using the method
  cardContainer[method](cardElement);
}

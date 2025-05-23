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
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");

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

const modalImage = document.querySelector("#modal-image");
const closeModalImage = modalImage.querySelector(".modal__image-close-btn");

function getCardElement(data) {
  const cardTemplate = document.querySelector("#card-template").content;
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
    const image = modalImage.querySelector(".modal__image");
    image.setAttribute("src", data.link);
    image.setAttribute("alt", data.name);
    const caption = modalImage.querySelector(".modal__caption");
    caption.textContent = data.name;
    openModal(modalImage);
  });

  return cardElement;
}

closeModalImage.addEventListener("click", () => closeModal(modalImage));

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", function () {
  openModal(editProfileModal);
  fillEditProfileInputs();
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileName.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(editProfileModal);
});

function fillEditProfileInputs() {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
}

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const data = {
    name: captionInput.value,
    link: imageLinkInput.value,
  };
  cardContainer.prepend(getCardElement(data));
  closeModal(newPostModal);
});

initialCards.forEach((card) => {
  const newCard = getCardElement(card);
  cardContainer.prepend(newCard);
});

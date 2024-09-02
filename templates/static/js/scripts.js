"use strict";

const allLinks = document.querySelectorAll("a:link");
const formComment = document.querySelector(".form-comment");
const notificationContainer = document.querySelector(".notification-container");
const btnDelete = document.querySelector(".btn-delete");

// Booleans for manipulateCommentClasses function
const add = true;
const remove = false;

allLinks.forEach(function (link) {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    if (href === "#") {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });
});

class CommentsFunctionalities {
  btnComment = document.querySelector(".btn-comment");
  btnCancel = document.querySelector(".btn-cancel");
  commentInput = document.querySelector(".comment-input");
  commentInputDefaultHeight = Number.parseInt(
    getComputedStyle(this.commentInput).height
  );
  formComment = document.querySelector(".form-comment");
  btnsCommentContainer = document.querySelector(".btns-container");
  btnsCommentContainerTop = Number.parseInt(
    getComputedStyle(this.btnsCommentContainer).top
  );
  btnsTopOffset;

  // Start all functionalities automatically
  constructor() {
    this.showCommentBtns();
    this.cleanInputCancel();
    this.autoAdjustTextAreaHeight();
  }

  manipulateCommentClasses(add) {
    if (add) {
      this.formComment.classList.add("form-focus");
      this.btnsCommentContainer.classList.add("btn-active");
    } else {
      this.formComment.classList.remove("form-focus");
      this.btnsCommentContainer.classList.remove("btn-active");
    }
  }

  // Show comment action buttons only when input is focused
  showCommentBtns() {
    this.formComment.addEventListener(
      "focus",
      (e) => {
        if (
          [this.btnComment, this.btnCancel, this.commentInput].includes(
            e.target
          )
        )
          this.manipulateCommentClasses(add);
      },
      true
    );

    this.formComment.addEventListener(
      "blur",
      (e) => {
        // If there's content in the input, buttons don't disappear
        if (this.commentInput.value === "") {
          this.manipulateCommentClasses(remove);
        }
      },
      true
    );
  }

  cleanInputCancel() {
    this.btnCancel.addEventListener("click", () => {
      this.commentInput.value = "";
      this.commentInput.style.height = `${this.commentInputDefaultHeight}px`;
      this.btnsCommentContainer.style.top = `${
        this.commentInputDefaultHeight + 20
      }px`;
      this.manipulateCommentClasses(remove);
    });
  }

  autoAdjustTextAreaHeight() {
    this.commentInput.addEventListener("keyup", (e) => {
      this.commentInput.style.height = "auto";

      const scHeight = e.target.scrollHeight;

      // Calculate offset just once to avoid negative values
      if (!this.btnsTopOffset)
        this.btnsTopOffset = this.btnsCommentContainerTop - scHeight;

      // Adjust comment action buttons along with the changing height of input
      this.btnsCommentContainer.style.top = `${
        scHeight + this.btnsTopOffset
      }px`;
      this.commentInput.style.height = `${scHeight}px`;
    });
  }
}
if (formComment) new CommentsFunctionalities();

function initRemoveNotification() {
  notificationContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-notification")) {
      e.target.closest(".notification").remove();

      if (notificationContainer.children.length === 0) {
        notificationContainer.remove();
      }
    }
  });
}
if (notificationContainer) initRemoveNotification();

function hideModal() {
  this.classList.add("modal-hidden");
}

function preventDelete() {
  const modalConfirmation = document.querySelector(".modal-confirmation");
  const formDeletion = document.querySelector(".form-deletion");
  const btnCloseModal = modalConfirmation.querySelector(".close-modal-icon");
  const btnConfirmDeletion = modalConfirmation.querySelector(
    ".btn-confirm-deletion"
  );
  const btnCancelDeletion = modalConfirmation.querySelector(
    ".btn-cancel-deletion"
  );

  formDeletion.addEventListener("submit", (e) => {
    e.preventDefault();

    modalConfirmation.classList.remove("modal-hidden");

    btnConfirmDeletion.addEventListener("click", () => {
      formDeletion.submit();
    });

    btnCloseModal.addEventListener("click", hideModal.bind(modalConfirmation));
    btnCancelDeletion.addEventListener(
      "click",
      hideModal.bind(modalConfirmation)
    );
  });
}

if (btnDelete) preventDelete();

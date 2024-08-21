"use strict";

const allLinks = document.querySelectorAll("a:link");
const btnComment = document.querySelector(".btn-comment");
const btnCancel = document.querySelector(".btn-cancel");
const commentInput = document.querySelector(".comment-input");
const commentInputDefaultHeight = Number.parseInt(
  getComputedStyle(commentInput).height
);
console.log(commentInputDefaultHeight);
const formComment = document.querySelector(".form-comment");
const btnsCommentContainer = document.querySelector(".btns-container");
const btnsCommentContainerTop = Number.parseInt(
  getComputedStyle(btnsCommentContainer).top
);
let btnsTopOffset;

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

function manipulateCommentClasses(add) {
  if (add) {
    formComment.classList.add("form-focus");
    btnsCommentContainer.classList.add("btn-active");
  } else {
    formComment.classList.remove("form-focus");
    btnsCommentContainer.classList.remove("btn-active");
  }
}

// Show comment action buttons only when input is focused
function showCommentBtns() {
  formComment.addEventListener(
    "focus",
    (e) => {
      if ([btnComment, btnCancel, commentInput].includes(e.target))
        manipulateCommentClasses(add);
    },
    true
  );

  formComment.addEventListener(
    "blur",
    (e) => {
      // If there's content in the input, buttons don't disappear
      if (commentInput.value === "") {
        manipulateCommentClasses(remove);
      }
    },
    true
  );
}
if (formComment) showCommentBtns();

function cleanInputCancel() {
  btnCancel.addEventListener("click", () => {
    commentInput.value = "";
    commentInput.style.height = `${commentInputDefaultHeight}px`;
    btnsCommentContainer.style.top = `${commentInputDefaultHeight + 20}px`;
    manipulateCommentClasses(remove);
  });
}
if (formComment) cleanInputCancel();

function autoAdjustTextAreaHeight() {
  commentInput.addEventListener("keyup", (e) => {
    commentInput.style.height = "auto";

    const scHeight = e.target.scrollHeight;

    // Calculate offset just once to avoid negative values
    if (!btnsTopOffset) btnsTopOffset = btnsCommentContainerTop - scHeight;

    // Adjust comment action buttons along with the changing height of input
    btnsCommentContainer.style.top = `${scHeight + btnsTopOffset}px`;
    commentInput.style.height = `${scHeight}px`;
  });
}
if (commentInput) autoAdjustTextAreaHeight();

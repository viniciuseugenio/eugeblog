export default function CommentView({ comment, setIsEditing, actionStates }) {
  function handleEdit() {
    setIsEditing(true);
    setTimeout(() => {
      const input = document.getElementById("edit-comment");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 100);
  }
}

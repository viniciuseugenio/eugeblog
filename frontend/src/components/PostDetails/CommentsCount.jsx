export default function CommentsCount({ qty }) {
  let count;

  if (qty === 0) {
    count = "No comments yet...";
  } else if (qty === 1) {
    count = "1 comment";
  } else {
    count = `${qty} comments`;
  }

  return (
    <div>
      <h2 className="mb-4 text-3xl font-bold">{count}</h2>
    </div>
  );
}
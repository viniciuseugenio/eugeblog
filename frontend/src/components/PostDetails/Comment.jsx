import { CircleUser } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "../../store/auth-context";
import { formatDate } from "../../utils/helpers";
import CommentEditor from "./CommentEditor";
import CommentView from "./CommentView";

export default function Comment({ comment }) {
  const createdAt = formatDate(comment.created_at);
  const authorName = `${comment.author.first_name} ${comment.author.last_name}`;

  const { userId } = useAuthContext();
  const isAuthor = userId === comment.author.id;

  const actionStates =
    "group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:scale-100 group-hover:opacity-100";

  const blueButtonStyle =
    "rounded-full p-2 text-blue-600 duration-300 hover:bg-blue-200 active:bg-blue-300";
  const redButtonStyle =
    "flex items-center justify-center rounded-full p-2 text-red-500 duration-300 hover:bg-red-200 hover:text-red-700 active:bg-red-300";

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      tabIndex={0}
      className="hover:bg-light/40 focus:bg-light/40 group grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] rounded-md px-2 py-1 duration-300"
    >
      <span className="row-span-2 mr-2 self-start p-1">
        <CircleUser />
      </span>
      <div className="flex gap-1 self-start">
        <span className="font-semibold">{authorName}</span>
        &mdash; {createdAt}
      </div>

      {isEditing ? (
        <CommentEditor
          comment={comment}
          setIsEditing={setIsEditing}
          actionStates={actionStates}
          blueButtonStyle={blueButtonStyle}
          redButtonStyle={redButtonStyle}
        />
      ) : (
        <CommentView
          comment={comment}
          actionStates={actionStates}
          setIsEditing={setIsEditing}
          isAuthor={isAuthor}
          blueButtonStyle={blueButtonStyle}
          redButtonStyle={redButtonStyle}
        />
      )}
    </div>
  );
}

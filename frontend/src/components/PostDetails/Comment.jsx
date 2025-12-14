import { CircleUser } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "../../store/auth-context";
import { formatDate } from "../../utils/helpers";
import ActionsDropdown from "./ActionsDropdown";
import CommentEditor from "./CommentEditor";

export default function Comment({ comment }) {
  const createdAt = formatDate(comment.createdAt);
  const authorName = `${comment.author.firstName} ${comment.author.lastName}`;

  const { user } = useAuthContext();
  const isAuthor = user?.id === comment.author.id;

  const actionStates =
    "group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:scale-100 group-hover:opacity-100";

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="group grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] rounded-md border-b px-2 py-1 pb-6 duration-300 last:border-0">
      <span className="row-span-2 mr-2 self-start p-1">
        <CircleUser className="h-8 w-8" />
      </span>
      <div className="col-span-2 mb-3 flex justify-between gap-1">
        <div>
          <p className="font-medium">{authorName}</p>
          <p className="text-xs text-neutral-500">{createdAt}</p>
        </div>

        {isAuthor && (
          <div className="flex items-center gap-1">
            <ActionsDropdown
              commentId={comment.id}
              setIsEditing={setIsEditing}
            />
          </div>
        )}
      </div>

      {isEditing ? (
        <CommentEditor
          comment={comment}
          setIsEditing={setIsEditing}
          actionStates={actionStates}
        />
      ) : (
        <p className="max-w-3xl self-start hyphens-auto break-words text-stone-700">
          {comment.content}
        </p>
      )}
    </div>
  );
}

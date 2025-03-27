import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { useCallback, useState } from "react";

export default function Editor({
  data,
  errors,
  placeholder = "Write something amazing...",
}) {
  const [content, setContent] = useState(data);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "h-full w-full focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  }, [editor]);

  const buttonClasses = (button, attr) => {
    let classes = "rounded-md p-2 duration-300 hover:scale-110";
    const isActive = editor.isActive(button, attr);
    const background = isActive
      ? " bg-accent/80 text-primary/70 hover:bg-accent"
      : " hover:bg-neutral-200";
    return classes + background;
  };

  const borderColor = errors
    ? "border-red-500 ring-red-200 focus-within:border-red-600"
    : "focus-within:border-primary/50 ring-accent/40 border-accent/50";

  return (
    <div className="space-y-2">
      <label
        className={`${errors ? "text-red-600" : "text-primary"}  text-sm font-medium`}
      >
        Content
      </label>
      <div
        className={`${borderColor} rounded-md border duration-300 focus-within:ring-2 hover:shadow-md`}
      >
        <div className="flex gap-2 rounded-md border-b bg-neutral-50 p-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={buttonClasses("bold")}
            title="Bold"
            type="button"
          >
            <Bold className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={buttonClasses("italic")}
            type="button"
          >
            <Italic className="h-5 w-5" />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={buttonClasses("heading", { level: 1 })}
            type="button"
          >
            <Heading1 className="h-5 w-5" />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={buttonClasses("heading", { level: 2 })}
            type="button"
          >
            <Heading2 className="h-5 w-5" />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={buttonClasses("heading", { level: 3 })}
            type="button"
          >
            <Heading3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={buttonClasses("bulletList")}
            type="button"
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={buttonClasses("orderedList")}
            type="button"
          >
            <ListOrdered className="h-5 w-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={buttonClasses("blockquote")}
            type="button"
          >
            <Quote className="h-5 w-5" />
          </button>
          <button
            onClick={setLink}
            className={buttonClasses("link")}
            type="button"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
        </div>

        <div
          className="relative"
          onClick={() => editor.chain().focus().run()}
          tabIndex={0}
        >
          <EditorContent
            editor={editor}
            className="prose max-h-96 max-w-none overflow-y-auto p-4"
          />
          <input type="hidden" name="content" value={content} />
          {editor.isEmpty && !editor.isFocused && (
            <div
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            >
              {placeholder}
            </div>
          )}
        </div>
      </div>
      {errors && (
        <ul className="text-sm text-red-600">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

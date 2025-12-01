"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { useCallback } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class:
            "rounded-lg border border-gray-200 shadow-sm max-w-full h-auto my-4",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your story...",
        emptyEditorClass:
          "is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none",
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 max-w-none focus:outline-none min-h-[300px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Image Upload Logic
  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // 1. Upload to your existing API
        const formData = new FormData();
        formData.append("file", file);
        formData.append("eventId", "blog-content"); // folder organization
        formData.append("mediaType", "IMAGE");

        try {
          const res = await fetch("/api/storage/cloudinary/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (data.url) {
            // 2. Insert image into editor
            editor?.chain().focus().setImage({ src: data.url }).run();
          }
        } catch (error) {
          console.error("Image upload failed", error);
          alert("Failed to upload image");
        }
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) return;

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col rounded-lg border border-input bg-background shadow-sm">
      {/* Menu Bar */}
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2">
        <Toggle
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={<Bold className="h-4 w-4" />}
        />
        <Toggle
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={<Italic className="h-4 w-4" />}
        />
        <div className="mx-1 h-4 w-px bg-border" />
        <Toggle
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          icon={<Heading1 className="h-4 w-4" />}
        />
        <Toggle
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          icon={<Heading2 className="h-4 w-4" />}
        />
        <div className="mx-1 h-4 w-px bg-border" />
        <Toggle
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={<List className="h-4 w-4" />}
        />
        <Toggle
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={<ListOrdered className="h-4 w-4" />}
        />
        <div className="mx-1 h-4 w-px bg-border" />
        <Toggle
          onClick={setLink}
          isActive={editor.isActive("link")}
          icon={<LinkIcon className="h-4 w-4" />}
        />
        <Toggle
          onClick={addImage}
          isActive={false}
          icon={<ImageIcon className="h-4 w-4" />}
        />
        <Toggle
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={<Quote className="h-4 w-4" />}
        />
      </div>

      {/* Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}

// Helper Button Component
function Toggle({
  onClick,
  isActive,
  icon,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      className="h-8 w-8"
      onClick={onClick}
    >
      {icon}
    </Button>
  );
}

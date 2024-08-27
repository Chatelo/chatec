"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createPost } from "@/app/lib/actions";
import { SessionUser } from "@/app/types";
import { useForm, Controller } from "react-hook-form";
import isHotkey from "is-hotkey";
import {
  Transforms,
  Editor,
  Text,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseEditor,
} from "slate";
import { Slate, Editable, withReact, useSlate, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";

type CustomElement = {
  type: string;
  children: CustomText[];
  align?: string;
  url?: string;
};
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const HOTKEYS: { [key: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const withImages = (editor: ReactEditor & HistoryEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result as string;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor: ReactEditor & HistoryEditor, url: string) => {
  const text = { text: "" };
  const image: CustomElement = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};

const isImageUrl = (url: string) => {
  if (!url) return false;
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
};

const Element = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: any;
  element: CustomElement;
}) => {
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          {...attributes}
          className="border-l-4 border-gray-300 pl-4 italic"
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul {...attributes} className="list-disc list-inside">
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 {...attributes} className="text-2xl font-bold">
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 {...attributes} className="text-xl font-bold">
          {children}
        </h2>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return (
        <ol {...attributes} className="list-decimal list-inside">
          {children}
        </ol>
      );
    case "image":
      return (
        <div {...attributes}>
          <Image
            src={element.url ?? ""}
            alt="Inserted image"
            width={500}
            height={300}
            className="max-w-full h-auto"
          />
          {children}
        </div>
      );
    default:
      return (
        <p
          {...attributes}
          className={element.align ? `text-${element.align}` : ""}
        >
          {children}
        </p>
      );
  }
};

const Leaf = ({
  attributes,
  children,
  leaf,
}: {
  attributes: any;
  children: any;
  leaf: CustomText;
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = <code className="bg-gray-100 rounded px-1">{children}</code>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof typeof n] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

const BlockButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate();
  return (
    <button
      className={`p-2 ${
        isBlockActive(editor, format) ? "text-blue-500" : "text-gray-500"
      }`}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </button>
  );
};

const MarkButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate();
  return (
    <button
      className={`p-2 ${
        isMarkActive(editor, format) ? "text-blue-500" : "text-gray-500"
      }`}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </button>
  );
};

export default function NewPost() {
  const [editor] = useState(() =>
    withImages(withHistory(withReact(createEditor())))
  );
  const router = useRouter();
  const { data: session, status } = useSession();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      title: "",
      content: [{ type: "paragraph", children: [{ text: "" }] }],
    },
  });

  const title = watch("title");
  const slug = useMemo(() => generateSlug(title), [title]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !(session.user as SessionUser).isAdmin) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  const onSubmit = async (data: { title: string; content: any }) => {
    try {
      await createPost({ title: data.title, content: data.content, slug });
      router.push("/admin/blog");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("An error occurred while creating the post.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !(session.user as SessionUser).isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Create New Post</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            Title
          </label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="title"
                className="w-full p-2 border rounded"
              />
            )}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2">
            Content
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Slate
                editor={editor}
                initialValue={field.value}
                onChange={field.onChange}
              >
                <div className="border rounded p-2">
                  <div className="flex flex-wrap mb-2">
                    <MarkButton format="bold" icon="B" />
                    <MarkButton format="italic" icon="I" />
                    <MarkButton format="underline" icon="U" />
                    <MarkButton format="code" icon="<>" />
                    <BlockButton format="heading-one" icon="H1" />
                    <BlockButton format="heading-two" icon="H2" />
                    <BlockButton format="block-quote" icon="❝" />
                    <BlockButton format="numbered-list" icon="1." />
                    <BlockButton format="bulleted-list" icon="•" />
                    <BlockButton format="left" icon="Left" />
                    <BlockButton format="center" icon="Center" />
                    <BlockButton format="right" icon="Right" />
                    <BlockButton format="justify" icon="Justify" />
                  </div>
                  <Editable
                    renderElement={Element}
                    renderLeaf={Leaf}
                    placeholder="Enter some rich text…"
                    spellCheck
                    autoFocus
                    className="min-h-[200px]"
                    onKeyDown={(event) => {
                      for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event as any)) {
                          event.preventDefault();
                          const mark = HOTKEYS[hotkey];
                          toggleMark(editor, mark);
                        }
                      }
                    }}
                  />
                </div>
              </Slate>
            )}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Generated Slug</label>
          <p className="p-2 bg-gray-100 rounded">{slug}</p>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updatePost, getPost } from "@/app/lib/actions";
import { Post, SessionUser } from "@/app/types";
import { useForm, Controller } from "react-hook-form";
import isHotkey from "is-hotkey";
import {
  Transforms,
  Editor,
  createEditor,
  Descendant,
  Element as SlateElement,
} from "slate";
import { Slate, Editable, withReact, useSlate, ReactEditor } from "slate-react";
import { BaseEditor } from "slate";
import { withHistory, HistoryEditor } from "slate-history";
import Image from "next/image";
import { SubmitHandler, FieldValues } from "react-hook-form";

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
            className="max-w-full h-auto"
            alt="Image"
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

const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes<CustomElement>(editor, {
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

export default function EditPost({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [editor] = useState(() =>
    withImages(withHistory(withReact(createEditor())))
  );
  const router = useRouter();
  const { data: session, status } = useSession();
  const { control, handleSubmit, setValue } = useForm();

  const fetchPost = useCallback(async () => {
    try {
      const fetchedPost = await getPost(parseInt(params.id));
      if (fetchedPost) {
        setPost(fetchedPost);
        setValue("title", fetchedPost.title);
        setValue("slug", fetchedPost.slug);
        const initialContent = fetchedPost.content;
        setValue("content", initialContent);
        editor.children = initialContent;
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    }
  }, [params.id, editor, setValue]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !(session.user as SessionUser).isAdmin) {
      router.push("/auth/signin");
    } else {
      fetchPost();
    }
  }, [session, status, router, fetchPost]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!post) return;

    try {
      const updatedPost = {
        title: data.title as string,
        content: data.content, // Send the content as is, without stringifying
        slug: data.slug as string,
      };

      await updatePost(parseInt(params.id), updatedPost);
      router.push("/admin/blog");
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("An error occurred while updating the post.");
    }
  };

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  if (status === "loading" || !post) {
    return <div>Loading...</div>;
  }

  if (!session || !(session.user as SessionUser).isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
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
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
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
          <label htmlFor="slug" className="block mb-2">
            Slug
          </label>
          <Controller
            name="slug"
            control={control}
            rules={{ required: "Slug is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="slug"
                className="w-full p-2 border rounded"
              />
            )}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}

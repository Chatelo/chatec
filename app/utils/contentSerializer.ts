import escapeHtml from "escape-html";
import { Text } from "slate";

const serializeNode = (node: any): string => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.code) {
      string = `<code>${string}</code>`;
    }
    return string;
  }

  const children = node.children.map((n: any) => serializeNode(n)).join("");

  switch (node.type) {
    case "block-quote":
      return `<blockquote>${children}</blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading-one":
      return `<h1>${children}</h1>`;
    case "heading-two":
      return `<h2>${children}</h2>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "image":
      return `<img src="${escapeHtml(node.url)}" alt="Image" />`;
    default:
      return children;
  }
};

export const serializeContent = (content: any): string => {
  if (Array.isArray(content)) {
    return content.map(serializeNode).join("");
  } else if (typeof content === "string") {
    return content;
  }
  return "";
};

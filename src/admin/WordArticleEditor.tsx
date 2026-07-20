import { useEffect, useRef } from "react";
import { Button, Select, Space, Upload, message } from "antd";
import {
  BoldOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

type WordArticleEditorProps = {
  value: string;
  onChange: (value: string) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploading?: boolean;
  tr: (english: string, chinese: string) => string;
};

const FONT_SIZE_MAP: Record<string, string> = {
  "1": "12",
  "2": "14",
  "3": "16",
  "4": "18",
  "5": "22",
  "6": "26",
  "7": "32",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeUrl(value: string) {
  const url = value.trim();
  return /^(https?:\/\/|mailto:)/i.test(url) ? url : "";
}

function inlineMarkdownToHtml(value: string) {
  let html = escapeHtml(value);
  html = html.replace(/\[size=(12|14|16|18|22|26|32)\]([\s\S]*?)\[\/size\]/g, '<span style="font-size:$1px">$2</span>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|mailto:[^)]+)\)/g, '<a href="$2">$1</a>');
  return html;
}

function markdownToEditorHtml(markdown: string) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const html: string[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);
    if (image) {
      html.push(`<figure><img src="${escapeHtml(image[2])}" alt="${escapeHtml(image[1] || "Article image")}"><figcaption>${escapeHtml(image[1] || "")}</figcaption></figure>`);
      index += 1;
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*] /.test(lines[index])) {
        items.push(`<li>${inlineMarkdownToHtml(lines[index].replace(/^\s*[-*] /, ""))}</li>`);
        index += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\. /.test(lines[index])) {
        items.push(`<li>${inlineMarkdownToHtml(lines[index].replace(/^\s*\d+\. /, ""))}</li>`);
        index += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    if (line.startsWith("### ")) html.push(`<h3>${inlineMarkdownToHtml(line.slice(4))}</h3>`);
    else if (line.startsWith("## ")) html.push(`<h2>${inlineMarkdownToHtml(line.slice(3))}</h2>`);
    else if (line.startsWith("# ")) html.push(`<h1>${inlineMarkdownToHtml(line.slice(2))}</h1>`);
    else if (line.startsWith("> ")) html.push(`<blockquote>${inlineMarkdownToHtml(line.slice(2))}</blockquote>`);
    else html.push(`<p>${inlineMarkdownToHtml(line)}</p>`);
    index += 1;
  }

  return html.join("");
}

function nodeToInlineMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
  if (!(node instanceof HTMLElement)) return "";

  const content = Array.from(node.childNodes).map(nodeToInlineMarkdown).join("");
  const tag = node.tagName.toLowerCase();
  if (tag === "strong" || tag === "b") return `**${content}**`;
  if (tag === "a") {
    const href = safeUrl(node.getAttribute("href") || "");
    return href ? `[${content}](${href})` : content;
  }
  if (tag === "font") {
    const size = FONT_SIZE_MAP[node.getAttribute("size") || "3"] || "16";
    return `[size=${size}]${content}[/size]`;
  }
  if (tag === "span") {
    const size = node.style.fontSize.match(/\d+/)?.[0];
    return size && ["12", "14", "16", "18", "22", "26", "32"].includes(size)
      ? `[size=${size}]${content}[/size]`
      : content;
  }
  if (tag === "br") return "\n";
  return content;
}

function editorHtmlToMarkdown(root: HTMLElement) {
  const blocks: string[] = [];

  Array.from(root.children).forEach((element) => {
    const tag = element.tagName.toLowerCase();
    const inline = Array.from(element.childNodes).map(nodeToInlineMarkdown).join("").trim();
    if (tag === "h1") blocks.push(`# ${inline}`);
    else if (tag === "h2") blocks.push(`## ${inline}`);
    else if (tag === "h3") blocks.push(`### ${inline}`);
    else if (tag === "blockquote") blocks.push(`> ${inline}`);
    else if (tag === "ul" || tag === "ol") {
      const items = Array.from(element.children).map((item, index) => {
        const content = Array.from(item.childNodes).map(nodeToInlineMarkdown).join("").trim();
        return tag === "ol" ? `${index + 1}. ${content}` : `- ${content}`;
      });
      blocks.push(items.join("\n"));
    } else if (tag === "figure") {
      const image = element.querySelector("img");
      const caption = element.querySelector("figcaption")?.textContent?.trim() || image?.getAttribute("alt") || "Article image";
      const src = safeUrl(image?.getAttribute("src") || "");
      if (src) blocks.push(`![${caption.replace(/[[\]]/g, "")}](${src})`);
    } else if (tag === "img") {
      const src = safeUrl(element.getAttribute("src") || "");
      if (src) blocks.push(`![${element.getAttribute("alt") || "Article image"}](${src})`);
    } else if (inline) blocks.push(inline);
  });

  return blocks.join("\n\n");
}

export function WordArticlePreview({ value }: { value: string }) {
  return <div className="word-article-preview" dangerouslySetInnerHTML={{ __html: markdownToEditorHtml(value) }} />;
}

export default function WordArticleEditor({ value, onChange, uploadImage, uploading, tr }: WordArticleEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const internalValueRef = useRef(value);

  useEffect(() => {
    if (!editorRef.current || value === internalValueRef.current) return;
    editorRef.current.innerHTML = markdownToEditorHtml(value);
    internalValueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = markdownToEditorHtml(value);
    internalValueRef.current = value;
    // The editor is initialized once when the modal content is mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function rememberSelection() {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (!selection || !savedRangeRef.current) return;
    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  }

  function syncValue() {
    if (!editorRef.current) return;
    const markdown = editorHtmlToMarkdown(editorRef.current);
    internalValueRef.current = markdown;
    onChange(markdown);
    rememberSelection();
  }

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, commandValue);
    syncValue();
  }

  function insertLink() {
    const url = window.prompt(tr("Enter the link URL", "请输入链接地址"), "https://");
    if (!url) return;
    const normalized = safeUrl(url);
    if (!normalized) {
      message.warning(tr("Use an http(s) or mailto link", "请输入 http(s) 或 mailto 链接"));
      return;
    }
    runCommand("createLink", normalized);
  }

  async function insertImage(file: File) {
    const url = await uploadImage(file);
    if (!url || !editorRef.current) return false;
    editorRef.current.focus();
    restoreSelection();
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");
    image.src = url;
    image.alt = "Article image";
    caption.textContent = "Article image";
    figure.append(image, caption);
    if (range) {
      let block = range.startContainer instanceof HTMLElement ? range.startContainer : range.startContainer.parentElement;
      while (block?.parentElement && block.parentElement !== editorRef.current) block = block.parentElement;
      if (block?.parentElement === editorRef.current) block.insertAdjacentElement("afterend", figure);
      else editorRef.current.appendChild(figure);
      range.setStartAfter(figure);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    } else {
      editorRef.current.appendChild(figure);
    }
    syncValue();
    return false;
  }

  return (
    <div className="word-article-editor">
      <div className="word-article-toolbar" onMouseDown={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest(".ant-btn") && !target.closest(".ant-upload-wrapper")) event.preventDefault();
      }}>
        <Space wrap size={6}>
          <Select
            defaultValue="p"
            style={{ width: 132 }}
            onChange={(format) => runCommand("formatBlock", format)}
            options={[
              { value: "p", label: tr("Paragraph", "正文段落") },
              { value: "h1", label: tr("Article Title", "文章标题") },
              { value: "h2", label: tr("Section Title", "一级标题") },
              { value: "h3", label: tr("Subheading", "二级标题") },
            ]}
          />
          <Select
            defaultValue="3"
            style={{ width: 104 }}
            onChange={(size) => runCommand("fontSize", size)}
            options={[
              { value: "2", label: tr("Small 14", "小号 14") },
              { value: "3", label: tr("Body 16", "正文 16") },
              { value: "4", label: tr("Large 18", "大号 18") },
              { value: "5", label: tr("Large 22", "大号 22") },
            ]}
          />
          <Button icon={<BoldOutlined />} onClick={() => runCommand("bold")}>{tr("Bold", "加粗")}</Button>
          <Button icon={<UnorderedListOutlined />} onClick={() => runCommand("insertUnorderedList")}>{tr("Bullets", "项目列表")}</Button>
          <Button icon={<OrderedListOutlined />} onClick={() => runCommand("insertOrderedList")}>{tr("Numbering", "编号列表")}</Button>
          <Button icon={<LinkOutlined />} onClick={insertLink}>{tr("Link", "链接")}</Button>
          <Upload accept="image/*" showUploadList={false} beforeUpload={insertImage}>
            <Button loading={uploading} icon={<PictureOutlined />}>{tr("Insert Image", "插入图片")}</Button>
          </Upload>
        </Space>
      </div>
      <div
        ref={editorRef}
        className="word-article-canvas"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={tr("Click here to write the article...", "点击这里开始撰写文章……")}
        onInput={syncValue}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
        onBlur={syncValue}
      />
    </div>
  );
}

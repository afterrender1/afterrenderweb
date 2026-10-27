"use client";

import React, { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Palette,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";

const TEXT_COLORS = ["#000000", "#374151", "#48A2FF", "#2563EB", "#16A34A", "#DC2626", "#F59E0B", "#9333EA"];
const HIGHLIGHT_COLORS = ["#FEF08A", "#BBF7D0", "#BFDBFE", "#FBCFE8", "#FED7AA", "#E9D5FF", "#FECACA", "#E5E7EB"];

const SAFE_LINK = /^(https?:\/\/|mailto:|#)/i;

const ToolButton = ({ onClick, active = false, disabled = false, label, children }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    aria-pressed={active}
    className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
      active ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span className="w-px h-5 bg-neutral-200 mx-1 shrink-0" />;

// Swatch popover used for both text color and highlight
const ColorPicker = ({ label, icon, colors, activeColor, onPick, onClear }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (e.type === "keydown" ? e.key === "Escape" : !ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <ToolButton label={label} active={open || !!activeColor} onClick={() => setOpen((o) => !o)}>
        {icon}
      </ToolButton>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 w-44 p-2.5 rounded-xl bg-white border border-neutral-200 shadow-xl">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(c);
                  setOpen(false);
                }}
                aria-label={`${label} ${c}`}
                className={`w-8 h-8 rounded-lg border cursor-pointer ${
                  activeColor?.toLowerCase() === c.toLowerCase() ? "border-neutral-900 ring-2 ring-neutral-900/20" : "border-neutral-200"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <input
              type="color"
              aria-label={`Custom ${label.toLowerCase()}`}
              value={/^#[0-9a-f]{6}$/i.test(activeColor || "") ? activeColor : colors[0]}
              onChange={(e) => onPick(e.target.value)}
              className="w-8 h-7 p-0 border border-neutral-200 rounded cursor-pointer bg-white"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onClear();
                setOpen(false);
              }}
              className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Toolbar = ({ editor }) => {
  // v3 doesn't re-render on every transaction, so read only what the toolbar needs
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      p: e.isActive("paragraph"),
      h1: e.isActive("heading", { level: 1 }),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      left: e.isActive({ textAlign: "left" }),
      center: e.isActive({ textAlign: "center" }),
      right: e.isActive({ textAlign: "right" }),
      link: e.isActive("link"),
      href: e.getAttributes("link").href || "",
      color: e.getAttributes("textStyle").color || "",
      highlight: e.getAttributes("highlight").color || "",
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const setLink = () => {
    const url = window.prompt("Link URL (https://, mailto: or #)", s.href);
    if (url === null) return;
    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    if (!SAFE_LINK.test(trimmed)) {
      window.alert("Only http(s), mailto and # links are allowed.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  };

  const c = () => editor.chain().focus();

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 p-2 bg-white border-b border-neutral-200 rounded-t-xl">
      <ToolButton label="Undo" disabled={!s.canUndo} onClick={() => c().undo().run()}><Undo2 size={16} /></ToolButton>
      <ToolButton label="Redo" disabled={!s.canRedo} onClick={() => c().redo().run()}><Redo2 size={16} /></ToolButton>
      <Divider />
      <ToolButton label="Paragraph" active={s.p} onClick={() => c().setParagraph().run()}><Pilcrow size={16} /></ToolButton>
      <ToolButton label="Heading 1" active={s.h1} onClick={() => c().toggleHeading({ level: 1 }).run()}><Heading1 size={16} /></ToolButton>
      <ToolButton label="Heading 2" active={s.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></ToolButton>
      <ToolButton label="Heading 3" active={s.h3} onClick={() => c().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></ToolButton>
      <Divider />
      <ToolButton label="Bold" active={s.bold} onClick={() => c().toggleBold().run()}><Bold size={16} /></ToolButton>
      <ToolButton label="Italic" active={s.italic} onClick={() => c().toggleItalic().run()}><Italic size={16} /></ToolButton>
      <ToolButton label="Underline" active={s.underline} onClick={() => c().toggleUnderline().run()}><Underline size={16} /></ToolButton>
      <ToolButton label="Strikethrough" active={s.strike} onClick={() => c().toggleStrike().run()}><Strikethrough size={16} /></ToolButton>
      <ToolButton label="Inline code" active={s.code} onClick={() => c().toggleCode().run()}><Code size={16} /></ToolButton>
      <Divider />
      <ColorPicker
        label="Text color"
        icon={<Palette size={16} style={s.color ? { color: s.color } : undefined} />}
        colors={TEXT_COLORS}
        activeColor={s.color}
        onPick={(col) => c().setColor(col).run()}
        onClear={() => c().unsetColor().run()}
      />
      <ColorPicker
        label="Highlight"
        icon={<Highlighter size={16} />}
        colors={HIGHLIGHT_COLORS}
        activeColor={s.highlight}
        onPick={(col) => c().setHighlight({ color: col }).run()}
        onClear={() => c().unsetHighlight().run()}
      />
      <Divider />
      <ToolButton label="Bullet list" active={s.bullet} onClick={() => c().toggleBulletList().run()}><List size={16} /></ToolButton>
      <ToolButton label="Numbered list" active={s.ordered} onClick={() => c().toggleOrderedList().run()}><ListOrdered size={16} /></ToolButton>
      <ToolButton label="Quote" active={s.quote} onClick={() => c().toggleBlockquote().run()}><Quote size={16} /></ToolButton>
      <ToolButton label="Divider line" onClick={() => c().setHorizontalRule().run()}><Minus size={16} /></ToolButton>
      <Divider />
      <ToolButton label="Align left" active={s.left} onClick={() => c().setTextAlign("left").run()}><AlignLeft size={16} /></ToolButton>
      <ToolButton label="Align center" active={s.center} onClick={() => c().setTextAlign("center").run()}><AlignCenter size={16} /></ToolButton>
      <ToolButton label="Align right" active={s.right} onClick={() => c().setTextAlign("right").run()}><AlignRight size={16} /></ToolButton>
      <Divider />
      <ToolButton label="Add link" active={s.link} onClick={setLink}><Link2 size={16} /></ToolButton>
      <ToolButton label="Remove link" disabled={!s.link} onClick={() => c().extendMarkRange("link").unsetLink().run()}><Link2Off size={16} /></ToolButton>
      <ToolButton label="Clear formatting" onClick={() => c().unsetAllMarks().clearNodes().run()}><RemoveFormatting size={16} /></ToolButton>
    </div>
  );
};

const RichTextEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editorProps: {
      attributes: { class: "blog-content blog-editor min-h-[360px] px-1 py-4 outline-none" },
    },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
  });

  // The parent clears or swaps `value` (after publish, or when another post is opened)
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if ((value || "") !== current) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [value, editor]);

  const text = editor?.getText() ?? "";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="border border-neutral-200 rounded-xl bg-white focus-within:border-[#80C1FC] focus-within:ring-2 focus-within:ring-[#80C1FC]/30 transition">
      {editor && <Toolbar editor={editor} />}
      <div className="px-4 sm:px-5">
        <EditorContent editor={editor} />
      </div>
      <div className="px-4 py-2 border-t border-neutral-100 text-[11px] font-medium text-neutral-400">
        {words} {words === 1 ? "word" : "words"} · ~{minutes} min read
      </div>
    </div>
  );
};

export default RichTextEditor;

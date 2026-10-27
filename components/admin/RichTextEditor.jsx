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
    className={`size-8 shrink-0 grid place-items-center rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 ${
      active ? "bg-stone-900 text-stone-50" : "text-stone-600 hover:bg-stone-200/60"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span className="w-px h-5 bg-stone-200 mx-1 shrink-0" />;

// Swatch popover used for both text color and highlight
const ColorPicker = ({ label, icon, colors, activeColor, onPick, onClear }) => {
  const [pos, setPos] = useState(null);
  const ref = useRef(null);
  const open = pos !== null;

  const toggle = () => {
    if (open) return setPos(null);
    const rect = ref.current.getBoundingClientRect();
    // 11rem popover; keep it inside the viewport
    setPos({ top: rect.bottom + 4, left: Math.max(8, Math.min(rect.left, window.innerWidth - 184)) });
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setPos(null);
    const onMouseDown = (e) => !ref.current?.contains(e.target) && !e.target.closest?.("[data-color-popover]") && close();
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    // The toolbar scrolls sideways on phones, so close instead of leaving the popover detached
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const setOpen = (v) => !v && setPos(null);

  return (
    <div ref={ref} className="relative shrink-0">
      <ToolButton label={label} active={open || !!activeColor} onClick={toggle}>
        {icon}
      </ToolButton>
      {open && (
        <div
          data-color-popover
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-[80] w-44 p-2.5 rounded-lg bg-white border border-stone-200 shadow-xl"
        >
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
                className={`size-8 rounded-md border cursor-pointer ${
                  activeColor?.toLowerCase() === c.toLowerCase() ? "border-stone-900 ring-2 ring-stone-900/20" : "border-stone-200"
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
              className="w-8 h-7 p-0 border border-stone-200 rounded cursor-pointer bg-white"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onClear();
                setOpen(false);
              }}
              className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 cursor-pointer"
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
    <div className="sticky top-0 z-20 flex flex-nowrap sm:flex-wrap items-center gap-0.5 p-1.5 sm:p-2 overflow-x-auto sm:overflow-visible bg-stone-50/95 backdrop-blur border-b border-stone-200 rounded-t-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
    <div className="min-w-0 border border-stone-200 rounded-lg bg-white focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-900/10 transition-colors">
      {editor && <Toolbar editor={editor} />}
      <div className="px-3 sm:px-5 min-w-0">
        <EditorContent editor={editor} />
      </div>
      <div className="px-3 sm:px-4 py-2 border-t border-stone-100 text-[11px] font-medium text-stone-400">
        {words} {words === 1 ? "word" : "words"} · ~{minutes} min read
      </div>
    </div>
  );
};

export default RichTextEditor;

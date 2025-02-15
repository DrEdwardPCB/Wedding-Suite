"use client"
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {  useField , FieldHookConfig} from 'formik';

// Custom Formik-integrated Tiptap field component
interface TipTapFieldProps {
    label: string;
  }
export const TipTapField = ({ label, ...props }:TipTapFieldProps& FieldHookConfig<string>) => {
  const [field, meta, helpers] = useField(props);
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: field.value,
    onUpdate: ({ editor }) => {
      helpers.setValue(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="space-x-2 mb-4">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('paragraph') ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Paragraph
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Bullet List
        </button>
      </div>

      <div className="border rounded-lg p-4">
        <EditorContent editor={editor} />
      </div>

      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

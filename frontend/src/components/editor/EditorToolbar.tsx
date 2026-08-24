import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Dropdown } from '../common/Dropdown.js';
import { LetterheadDropdown } from './LetterheadDropdown.js';
import { CompanyProfile } from '../dashboard/CompanyProfileModal.js';
import {
  RotateCcw,
  RotateCw,
  Printer,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Baseline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon,
  Table as TableIcon,
  Link as LinkIcon,
  FileDown,
  Heading1,
  Heading2,
  Heading3,
  Type,
  MoveVertical,
  Sliders,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
  onImageModal: () => void;
  onLinkModal: () => void;
  onPageSettings: () => void;
  currentProfileId: string | null;
  isLetterheadActive: boolean;
  onSelectProfile: (profile: CompanyProfile) => void;
  onOpenAddModal: () => void;
  onRemoveLetterhead: () => void;
  onPrint: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onImageModal,
  onLinkModal,
  onPageSettings,
  currentProfileId,
  isLetterheadActive,
  onSelectProfile,
  onOpenAddModal,
  onRemoveLetterhead,
  onPrint,
  zoom,
  onZoomChange,
}) => {
  const [textColor, setTextColor] = useState('#1e293b');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [fontSizeVal, setFontSizeVal] = useState('11pt');
  const [fontFamilyVal, setFontFamilyVal] = useState('Inter');
  const [lineHeightVal, setLineHeightVal] = useState('1.6');

  if (!editor) return null;

  const handleHeadingChange = (level: string) => {
    if (level === 'p') {
      editor.chain().focus().setParagraph().run();
    } else {
      const lvl = parseInt(level, 10) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level: lvl }).run();
    }
  };

  const handleFontFamily = (family: string) => {
    setFontFamilyVal(family);
    editor.chain().focus().setFontFamily(family).run();
  };

  const handleFontSize = (size: string) => {
    setFontSizeVal(size);
    (editor.chain().focus() as any).setFontSize(size).run();
  };

  const handleTextColor = (color: string) => {
    setTextColor(color);
    editor.chain().focus().setColor(color).run();
  };

  const handleHighlight = (color: string) => {
    setHighlightColor(color);
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  const handleLineHeight = (lh: string) => {
    setLineHeightVal(lh);
    (editor.chain().focus() as any).setLineHeight(lh).run();
  };

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return '1';
    if (editor.isActive('heading', { level: 2 })) return '2';
    if (editor.isActive('heading', { level: 3 })) return '3';
    return 'p';
  };

  return (
    <div className="editor-toolbar no-print">
      {/* Undo, Redo, Print */}
      <div className="toolbar-group">
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw size={15} />
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <RotateCw size={15} />
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={onPrint}
          title="Print (Ctrl+P)"
        >
          <Printer size={15} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Canvas Zoom */}
      <div className="toolbar-group">
        <Dropdown
          value={String(zoom)}
          onChange={(val) => onZoomChange(Number(val))}
          options={[
            { value: '50', label: '50%' },
            { value: '75', label: '75%' },
            { value: '90', label: '90%' },
            { value: '100', label: '100%' },
            { value: '125', label: '125%' },
            { value: '150', label: '150%' },
            { value: '175', label: '175%' },
          ]}
          menuWidth="90px"
        />
      </div>

      <div className="toolbar-divider" />

      {/* Paragraph / Heading Styles */}
      <div className="toolbar-group">
        <Dropdown
          value={getCurrentHeading()}
          onChange={(val) => handleHeadingChange(String(val))}
          options={[
            { value: 'p', label: 'Normal Text', icon: <Type size={13} /> },
            { value: '1', label: 'Heading 1', icon: <Heading1 size={13} /> },
            { value: '2', label: 'Heading 2', icon: <Heading2 size={13} /> },
            { value: '3', label: 'Heading 3', icon: <Heading3 size={13} /> },
          ]}
          menuWidth="140px"
        />
      </div>

      {/* Font Family */}
      <div className="toolbar-group">
        <Dropdown
          value={fontFamilyVal}
          onChange={(val) => handleFontFamily(String(val))}
          options={[
            { value: 'Inter', label: 'Inter (Sans)' },
            { value: 'Roboto', label: 'Roboto' },
            { value: 'Outfit', label: 'Outfit' },
            { value: 'Playfair Display', label: 'Playfair (Serif)' },
            { value: 'Merriweather', label: 'Merriweather' },
            { value: 'Lora', label: 'Lora' },
            { value: 'Cinzel', label: 'Cinzel (Formal)' },
            { value: 'JetBrains Mono', label: 'JetBrains Mono' },
            { value: 'Dancing Script', label: 'Dancing Script' },
          ]}
          menuWidth="160px"
        />
      </div>

      {/* Font Size */}
      <div className="toolbar-group">
        <Dropdown
          value={fontSizeVal}
          onChange={(val) => handleFontSize(String(val))}
          options={[
            { value: '9pt', label: '9 pt' },
            { value: '10pt', label: '10 pt' },
            { value: '11pt', label: '11 pt' },
            { value: '12pt', label: '12 pt' },
            { value: '14pt', label: '14 pt' },
            { value: '16pt', label: '16 pt' },
            { value: '18pt', label: '18 pt' },
            { value: '20pt', label: '20 pt' },
            { value: '24pt', label: '24 pt' },
            { value: '30pt', label: '30 pt' },
            { value: '36pt', label: '36 pt' },
          ]}
          menuWidth="90px"
        />
      </div>

      <div className="toolbar-divider" />

      {/* Formatting Marks (B, I, U, S) */}
      <div className="toolbar-group">
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={15} />
        </button>
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough size={15} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Colors (Text Color & Highlight) */}
      <div className="toolbar-group">
        <label className="toolbar-btn color-picker-wrapper" title="Text Color">
          <Baseline size={15} style={{ color: textColor }} />
          <input
            type="color"
            className="color-input-hidden"
            value={textColor}
            onChange={(e) => handleTextColor(e.target.value)}
          />
        </label>

        <label className="toolbar-btn color-picker-wrapper" title="Highlight Color">
          <Highlighter size={15} style={{ color: highlightColor }} />
          <input
            type="color"
            className="color-input-hidden"
            value={highlightColor}
            onChange={(e) => handleHighlight(e.target.value)}
          />
        </label>
      </div>

      <div className="toolbar-divider" />

      {/* Alignment */}
      <div className="toolbar-group">
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align Left"
        >
          <AlignLeft size={15} />
        </button>
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align Center"
        >
          <AlignCenter size={15} />
        </button>
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align Right"
        >
          <AlignRight size={15} />
        </button>
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="Justify"
        >
          <AlignJustify size={15} />
        </button>
      </div>

      {/* Line Spacing */}
      <div className="toolbar-group">
        <Dropdown
          value={lineHeightVal}
          onChange={(val) => handleLineHeight(String(val))}
          options={[
            { value: '1.0', label: 'Single (1.0)' },
            { value: '1.15', label: '1.15' },
            { value: '1.5', label: '1.5' },
            { value: '1.6', label: 'Normal (1.6)' },
            { value: '2.0', label: 'Double (2.0)' },
          ]}
          icon={<MoveVertical size={13} />}
          menuWidth="130px"
          align="right"
        />
      </div>

      <div className="toolbar-divider" />

      {/* Lists */}
      <div className="toolbar-group">
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered size={15} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Insert items (Table, Image, Link, PageBreak) */}
      <div className="toolbar-group">
        <button
          type="button"
          className="toolbar-btn"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          title="Insert Table (3x3)"
        >
          <TableIcon size={15} />
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={onImageModal}
          title="Insert Image"
        >
          <ImageIcon size={15} />
        </button>
        <button
          type="button"
          className={`toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
          onClick={onLinkModal}
          title="Insert / Edit Link"
        >
          <LinkIcon size={15} />
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => (editor.chain().focus() as any).setPageBreak().run()}
          title="Insert Page Break"
        >
          <FileDown size={15} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Letterhead Dropdown Menu & Page Setup */}
      <div className="toolbar-group" style={{ marginLeft: 'auto', gap: 6 }}>
        <LetterheadDropdown
          currentProfileId={currentProfileId}
          isLetterheadActive={isLetterheadActive}
          onSelectProfile={onSelectProfile}
          onOpenAddModal={onOpenAddModal}
          onRemoveLetterhead={onRemoveLetterhead}
        />

        <button
          type="button"
          className="toolbar-btn"
          onClick={onPageSettings}
          title="Page Margins & Sizing"
          style={{ width: 'auto', padding: '0 8px', gap: 5 }}
        >
          <Sliders size={14} />
          <span style={{ fontSize: '0.75rem' }}>Page Setup</span>
        </button>
      </div>
    </div>
  );
};

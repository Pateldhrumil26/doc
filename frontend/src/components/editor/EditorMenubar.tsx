import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Scissors,
  Clipboard,
  RotateCcw,
  RotateCw,
  Image as ImageIcon,
  Table as TableIcon,
  Link as LinkIcon,
  Minus,
  FileDown,
  Layout,
  Stamp,
  Maximize2,
} from 'lucide-react';

interface EditorMenubarProps {
  editor: Editor | null;
  onPageSettings: () => void;
  onHeaderFooter: () => void;
  onImageModal: () => void;
  onLinkModal: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onDuplicate: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
}

export const EditorMenubar: React.FC<EditorMenubarProps> = ({
  editor,
  onPageSettings,
  onHeaderFooter,
  onImageModal,
  onLinkModal,
  onPrint,
  onDownloadPdf,
  onDuplicate,
  zoom,
  onZoomChange,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menubarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menubarRef.current && !menubarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleInsertDate = () => {
    if (!editor) return;
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    editor.chain().focus().insertContent(dateStr).run();
    setOpenMenu(null);
  };

  return (
    <div className="editor-menubar no-print" ref={menubarRef}>
      {/* FILE MENU */}
      <div className="menu-item-dropdown">
        <button
          className={`menu-trigger ${openMenu === 'file' ? 'active' : ''}`}
          onClick={() => toggleMenu('file')}
        >
          File
        </button>
        {openMenu === 'file' && (
          <div className="menu-dropdown-menu">
            <button
              className="menu-action-item"
              onClick={() => {
                onDuplicate();
                setOpenMenu(null);
              }}
            >
              <span>Make a copy</span>
              <span className="shortcut">Duplicate</span>
            </button>
            <div className="menu-divider" />
            <button
              className="menu-action-item"
              onClick={() => {
                onPageSettings();
                setOpenMenu(null);
              }}
            >
              <span>Page setup & margins...</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                onPrint();
                setOpenMenu(null);
              }}
            >
              <span>Print</span>
              <span className="shortcut">Ctrl+P</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                onDownloadPdf();
                setOpenMenu(null);
              }}
            >
              <span>Download PDF (.pdf)</span>
            </button>
          </div>
        )}
      </div>

      {/* EDIT MENU */}
      <div className="menu-item-dropdown">
        <button
          className={`menu-trigger ${openMenu === 'edit' ? 'active' : ''}`}
          onClick={() => toggleMenu('edit')}
        >
          Edit
        </button>
        {openMenu === 'edit' && (
          <div className="menu-dropdown-menu">
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().undo().run();
                setOpenMenu(null);
              }}
              disabled={!editor?.can().undo()}
            >
              <span>Undo</span>
              <span className="shortcut">Ctrl+Z</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().redo().run();
                setOpenMenu(null);
              }}
              disabled={!editor?.can().redo()}
            >
              <span>Redo</span>
              <span className="shortcut">Ctrl+Y</span>
            </button>
            <div className="menu-divider" />
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().selectAll().run();
                setOpenMenu(null);
              }}
            >
              <span>Select all</span>
              <span className="shortcut">Ctrl+A</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().unsetAllMarks().clearNodes().run();
                setOpenMenu(null);
              }}
            >
              <span>Clear formatting</span>
              <span className="shortcut">Ctrl+\</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW MENU */}
      <div className="menu-item-dropdown">
        <button
          className={`menu-trigger ${openMenu === 'view' ? 'active' : ''}`}
          onClick={() => toggleMenu('view')}
        >
          View
        </button>
        {openMenu === 'view' && (
          <div className="menu-dropdown-menu">
            <button
              className="menu-action-item"
              onClick={() => {
                onZoomChange(100);
                setOpenMenu(null);
              }}
            >
              <span>100% Zoom (Default)</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                onZoomChange(Math.min(zoom + 15, 175));
                setOpenMenu(null);
              }}
            >
              <span>Zoom In (+15%)</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                onZoomChange(Math.max(zoom - 15, 50));
                setOpenMenu(null);
              }}
            >
              <span>Zoom Out (-15%)</span>
            </button>
            <div className="menu-divider" />
            <button
              className="menu-action-item"
              onClick={() => {
                onHeaderFooter();
                setOpenMenu(null);
              }}
            >
              <span>Toggle Company Letterhead</span>
            </button>
          </div>
        )}
      </div>

      {/* INSERT MENU */}
      <div className="menu-item-dropdown">
        <button
          className={`menu-trigger ${openMenu === 'insert' ? 'active' : ''}`}
          onClick={() => toggleMenu('insert')}
        >
          Insert
        </button>
        {openMenu === 'insert' && (
          <div className="menu-dropdown-menu">
            <button
              className="menu-action-item"
              onClick={() => {
                onImageModal();
                setOpenMenu(null);
              }}
            >
              <span>Image...</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor
                  ?.chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run();
                setOpenMenu(null);
              }}
            >
              <span>Table (3x3)</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                onLinkModal();
                setOpenMenu(null);
              }}
            >
              <span>Link...</span>
              <span className="shortcut">Ctrl+K</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().setHorizontalRule().run();
                setOpenMenu(null);
              }}
            >
              <span>Horizontal line</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                (editor?.chain().focus() as any).setPageBreak().run();
                setOpenMenu(null);
              }}
            >
              <span>Page break</span>
            </button>
            <button
              className="menu-action-item"
              onClick={handleInsertDate}
            >
              <span>Current date</span>
            </button>
          </div>
        )}
      </div>

      {/* FORMAT MENU */}
      <div className="menu-item-dropdown">
        <button
          className={`menu-trigger ${openMenu === 'format' ? 'active' : ''}`}
          onClick={() => toggleMenu('format')}
        >
          Format
        </button>
        {openMenu === 'format' && (
          <div className="menu-dropdown-menu">
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().toggleBold().run();
                setOpenMenu(null);
              }}
            >
              <span>Bold</span>
              <span className="shortcut">Ctrl+B</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().toggleItalic().run();
                setOpenMenu(null);
              }}
            >
              <span>Italic</span>
              <span className="shortcut">Ctrl+I</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().toggleUnderline().run();
                setOpenMenu(null);
              }}
            >
              <span>Underline</span>
              <span className="shortcut">Ctrl+U</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().toggleStrike().run();
                setOpenMenu(null);
              }}
            >
              <span>Strikethrough</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().toggleSuperscript().run();
                setOpenMenu(null);
              }}
            >
              <span>Superscript</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().toggleSubscript().run();
                setOpenMenu(null);
              }}
            >
              <span>Subscript</span>
            </button>
            <div className="menu-divider" />
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().setTextAlign('left').run();
                setOpenMenu(null);
              }}
            >
              <span>Align Left</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().setTextAlign('center').run();
                setOpenMenu(null);
              }}
            >
              <span>Align Center</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().setTextAlign('right').run();
                setOpenMenu(null);
              }}
            >
              <span>Align Right</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                editor?.chain().focus().setTextAlign('justify').run();
                setOpenMenu(null);
              }}
            >
              <span>Justify</span>
            </button>
          </div>
        )}
      </div>

      {/* LETTER PAD QUICK TOOLS */}
      <div className="menu-item-dropdown">
        <button
          className={`menu-trigger ${openMenu === 'letterpad' ? 'active' : ''}`}
          onClick={() => toggleMenu('letterpad')}
        >
          Letter Pad Tools
        </button>
        {openMenu === 'letterpad' && (
          <div className="menu-dropdown-menu">
            <button
              className="menu-action-item"
              onClick={() => {
                onHeaderFooter();
                setOpenMenu(null);
              }}
            >
              <span>Toggle Company Letterhead</span>
            </button>
            <button
              className="menu-action-item"
              onClick={() => {
                onPageSettings();
                setOpenMenu(null);
              }}
            >
              <span>Page Size & Margin Setup</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

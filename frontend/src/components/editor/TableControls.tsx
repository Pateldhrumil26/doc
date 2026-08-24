import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Plus,
  Minus,
  Trash2,
  Columns,
  Rows,
  Split,
  Combine,
  Table as TableIcon,
} from 'lucide-react';

interface TableControlsProps {
  editor: Editor | null;
}

export const TableControls: React.FC<TableControlsProps> = ({ editor }) => {
  if (!editor || !editor.isActive('table')) {
    return null;
  }

  return (
    <div className="table-quick-toolbar no-print">
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
        <TableIcon size={14} /> Table:
      </span>

      <button
        type="button"
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="Add Row Above"
      >
        + Row Above
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="Add Row Below"
      >
        + Row Below
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="Delete Current Row"
        style={{ color: '#fca5a5' }}
      >
        Delete Row
      </button>

      <span style={{ color: '#475569' }}>|</span>

      <button
        type="button"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="Add Column Left"
      >
        + Col Left
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="Add Column Right"
      >
        + Col Right
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="Delete Current Column"
        style={{ color: '#fca5a5' }}
      >
        Delete Col
      </button>

      <span style={{ color: '#475569' }}>|</span>

      <button
        type="button"
        onClick={() => editor.chain().focus().mergeCells().run()}
        title="Merge Selected Cells"
      >
        Merge
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().splitCell().run()}
        title="Split Cell"
      >
        Split
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        title="Toggle Header Row"
      >
        Header
      </button>

      <span style={{ color: '#475569' }}>|</span>

      <button
        type="button"
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="Delete Entire Table"
        style={{ color: '#ef4444', fontWeight: 600 }}
      >
        <Trash2 size={13} style={{ verticalAlign: 'middle', marginRight: 2 }} />
        Delete Table
      </button>
    </div>
  );
};

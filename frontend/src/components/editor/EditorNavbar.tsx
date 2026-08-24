import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button.js';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Save,
} from 'lucide-react';

export type SaveStatus = 'saved' | 'saving' | 'failed' | 'unsaved';

interface EditorNavbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  saveStatus: SaveStatus;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onManualSave: () => void;
  hasUnsavedChanges: boolean;
}

export const EditorNavbar: React.FC<EditorNavbarProps> = ({
  title,
  onTitleChange,
  saveStatus,
  onPrint,
  onDownloadPdf,
  onManualSave,
  hasUnsavedChanges,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          'You have unsaved changes that will NOT be stored. Leave without saving?'
        )
      ) {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const renderStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="editor-save-status status-saving">
            <Clock size={12} /> Saving to database...
          </span>
        );
      case 'saved':
        return (
          <span className="editor-save-status status-saved">
            <CheckCircle2 size={12} /> All changes saved
          </span>
        );
      case 'failed':
        return (
          <span
            className="editor-save-status status-failed"
            onClick={onManualSave}
            style={{ cursor: 'pointer' }}
          >
            <AlertCircle size={12} /> Save failed (Click to retry)
          </span>
        );
      default:
        return (
          <span className="editor-save-status" style={{ color: '#d97706' }}>
            <Clock size={12} /> Unsaved changes
          </span>
        );
    }
  };

  return (
    <nav className="editor-navbar no-print">
      <div className="editor-title-container">
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleBack}
          title="Back to Dashboard"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="editor-app-logo" title="DocPad Studio">
          <FileText size={20} />
        </div>

        <div className="editor-doc-meta">
          <input
            type="text"
            className="editor-title-input"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled Document"
          />
          {renderStatus()}
        </div>
      </div>

      <div className="editor-nav-actions">
        {/* Explicit Save button */}
        <Button
          variant="primary"
          size="sm"
          icon={<Save size={15} />}
          onClick={onManualSave}
          title="Save changes to storage (Ctrl+S)"
          style={{ fontWeight: 600, padding: '0 14px' }}
        >
          Save
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={<Printer size={14} />}
          onClick={onPrint}
          title="Print Document (Ctrl+P)"
        >
          Print
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={<Download size={14} />}
          onClick={onDownloadPdf}
          title="Download printable PDF"
        >
          Download PDF
        </Button>
      </div>
    </nav>
  );
};

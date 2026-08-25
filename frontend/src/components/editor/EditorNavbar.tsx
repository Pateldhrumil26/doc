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
  History,
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
  currentVersion?: string;
  onOpenVersionHistory: () => void;
  isPreviewingVersion?: boolean;
}

export const EditorNavbar: React.FC<EditorNavbarProps> = ({
  title,
  onTitleChange,
  saveStatus,
  onPrint,
  onDownloadPdf,
  onManualSave,
  hasUnsavedChanges,
  currentVersion = 'v1.0',
  onOpenVersionHistory,
  isPreviewingVersion = false,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (hasUnsavedChanges && !isPreviewingVersion) {
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
    if (isPreviewingVersion) {
      return (
        <span className="editor-save-status" style={{ color: '#e47f25', fontWeight: 600 }}>
          <Clock size={12} /> Viewing historical version (Read-Only)
        </span>
      );
    }

    switch (saveStatus) {
      case 'saving':
        return (
          <span className="editor-save-status status-saving">
            <Clock size={12} /> Saving version to database...
          </span>
        );
      case 'saved':
        return (
          <span className="editor-save-status status-saved">
            <CheckCircle2 size={12} /> All changes saved ({currentVersion})
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
            <Clock size={12} /> Unsaved changes ({currentVersion})
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
            disabled={isPreviewingVersion}
          />
          {renderStatus()}
        </div>
      </div>

      <div className="editor-nav-actions">
        {/* Version History Button */}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onOpenVersionHistory}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 600,
            color: '#752f66',
            background: '#faf4f8',
            borderColor: '#f0dceb',
            padding: '6px 12px',
          }}
          title="Open Document Version History"
        >
          <History size={15} color="#752f66" />
          <span>Version History</span>
          <span
            style={{
              background: '#752f66',
              color: '#fff',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 10,
              marginLeft: 2,
            }}
          >
            {currentVersion}
          </span>
        </button>

        {/* Explicit Save button */}
        {!isPreviewingVersion && (
          <Button
            variant="primary"
            size="sm"
            icon={<Save size={15} />}
            onClick={onManualSave}
            title="Save changes and record version (Ctrl+S)"
            style={{ fontWeight: 600, padding: '0 14px' }}
          >
            Save
          </Button>
        )}

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

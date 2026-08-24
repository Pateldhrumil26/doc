import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentItem } from '../../types/document.types.js';
import {
  FileText,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Folder,
  Calendar,
  Stamp,
} from 'lucide-react';

interface DocumentCardProps {
  document: DocumentItem;
  viewMode: 'grid' | 'list';
  onRename: (doc: DocumentItem) => void;
  onDuplicate: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document: docItem,
  viewMode,
  onRename,
  onDuplicate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      window.document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return isoStr;
    }
  };

  const handleCardClick = () => {
    navigate(`/editor/${docItem._id}`);
  };

  if (viewMode === 'list') {
    return (
      <div className="doc-list-item" onClick={handleCardClick}>
        <div className="list-item-left">
          <div className="doc-type-icon">
            {docItem.letterpadConfig?.isLetterpadMode ? (
              <Stamp size={18} className="color-blue" />
            ) : (
              <FileText size={18} className="color-primary" />
            )}
          </div>
          <div className="doc-title-wrapper">
            <span className="doc-title">{docItem.title}</span>
            <span className="doc-folder-tag">
              <Folder size={12} /> {docItem.folder || 'General'}
            </span>
          </div>
        </div>

        <div className="list-item-meta">
          <span className="meta-date">
            <Calendar size={14} /> Modified {formatDate(docItem.updatedAt)}
          </span>
          <span className="meta-size">{docItem.pageSize}</span>
        </div>

        <div className="list-item-actions" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            className="action-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Actions"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="doc-actions-dropdown">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onRename(docItem);
                }}
              >
                <Edit2 size={14} /> Rename
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDuplicate(docItem);
                }}
              >
                <Copy size={14} /> Duplicate
              </button>
              <div className="dropdown-divider" />
              <button
                className="delete-btn"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(docItem);
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`doc-grid-card ${showMenu ? 'menu-open' : ''}`}
      onClick={handleCardClick}
    >
      <div className="grid-card-preview">
        <div className="paper-mockup">
          {docItem.header?.enabled && (
            <div className="mockup-header-line">
              <div className="mockup-logo-dot" />
              <div className="mockup-line-xs" />
            </div>
          )}
          <div className="mockup-body-lines">
            <div className="mockup-line mockup-line-long" />
            <div className="mockup-line mockup-line-med" />
            <div className="mockup-line mockup-line-long" />
            <div className="mockup-line mockup-line-short" />
          </div>
        </div>
      </div>

      <div className="grid-card-footer" onClick={(e) => e.stopPropagation()}>
        <div className="grid-card-title-row">
          <div className="grid-doc-icon">
            {docItem.letterpadConfig?.isLetterpadMode ? (
              <Stamp size={16} className="color-blue" />
            ) : (
              <FileText size={16} className="color-primary" />
            )}
          </div>
          <span className="grid-doc-title" title={docItem.title}>
            {docItem.title}
          </span>
          <div className="action-menu-wrapper" ref={menuRef}>
            <button
              className="action-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Actions"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="doc-actions-dropdown">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onRename(docItem);
                  }}
                >
                  <Edit2 size={14} /> Rename
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDuplicate(docItem);
                  }}
                >
                  <Copy size={14} /> Duplicate
                </button>
                <div className="dropdown-divider" />
                <button
                  className="delete-btn"
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(docItem);
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid-card-meta">
          <span className="meta-time">Modified {formatDate(docItem.updatedAt)}</span>
          <span className="meta-badge">{docItem.pageSize}</span>
        </div>
      </div>
    </div>
  );
};

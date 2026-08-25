import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  RotateCcw,
  Eye,
  CheckCircle2,
  Sparkles,
  Plus,
  ArrowLeft,
  Calendar,
  Layers,
  Trash2,
} from 'lucide-react';
import { DocumentVersion } from '../../types/document.types.js';
import { versionApi } from '../../api/versionApi.js';
import { useToast } from '../../context/ToastContext.js';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string | null;
  currentVersionNumber: string;
  previewVersionId: string | null;
  onPreviewVersion: (version: DocumentVersion | null) => void;
  onRestoreVersion: (version: DocumentVersion) => Promise<void>;
}

const formatVersionDate = (isoString?: string): string => {
  if (!isoString) return 'Just now';
  try {
    const d = new Date(isoString);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const time = d.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${day} ${month} ${year}, ${time}`;
  } catch (e) {
    return isoString;
  }
};

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  documentId,
  currentVersionNumber,
  previewVersionId,
  onPreviewVersion,
  onRestoreVersion,
}) => {
  const { success, error, info } = useToast();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [isAddingSnapshot, setIsAddingSnapshot] = useState(false);
  const [snapshotSummary, setSnapshotSummary] = useState('');
  const [creatingSnapshot, setCreatingSnapshot] = useState(false);

  const fetchVersions = async () => {
    if (!documentId) return;
    try {
      setLoading(true);
      const res = await versionApi.getVersions(documentId);
      if (res.success && res.data.versions) {
        setVersions(res.data.versions);
      }
    } catch (err: any) {
      error('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && documentId) {
      fetchVersions();
    } else {
      setIsAddingSnapshot(false);
      setSnapshotSummary('');
    }
  }, [isOpen, documentId]);

  if (!isOpen) return null;

  const handleRestore = async (v: DocumentVersion, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Restore document to ${v.versionNumber}? A new version will be created without deleting history.`
      )
    ) {
      try {
        setRestoringId(v._id);
        await onRestoreVersion(v);
        await fetchVersions();
        success(`Successfully restored to ${v.versionNumber}!`);
        onClose();
      } catch (err) {
        error('Failed to restore version');
      } finally {
        setRestoringId(null);
      }
    }
  };

  const handleDeleteVersion = async (v: DocumentVersion, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!documentId) return;
    if (versions.length <= 1) {
      alert('You must keep at least one version.');
      return;
    }
    if (confirm(`Are you sure you want to delete ${v.versionNumber}?`)) {
      try {
        await versionApi.deleteVersion(documentId, v._id);
        info(`Deleted ${v.versionNumber}`);
        if (previewVersionId === v._id) {
          onPreviewVersion(null);
        }
        await fetchVersions();
      } catch (err) {
        error('Failed to delete version');
      }
    }
  };

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId) return;

    try {
      setCreatingSnapshot(true);
      const res = await versionApi.createVersion(
        documentId,
        snapshotSummary.trim() || 'Manual snapshot'
      );
      if (res.success) {
        success('Manual version snapshot created!');
        setSnapshotSummary('');
        setIsAddingSnapshot(false);
        await fetchVersions();
      }
    } catch (err) {
      error('Failed to create snapshot');
    } finally {
      setCreatingSnapshot(false);
    }
  };

  return (
    <div
      className="letterhead-drawer-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        className="letterhead-drawer-panel"
        style={{
          width: '100%',
          maxWidth: '380px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-6px 0 28px rgba(15, 23, 42, 0.12)',
          borderLeft: '1px solid #edf2f6',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'auto',
          animation: 'slideInRight 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Drawer Top Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #edf2f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#faf4f8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: '#752f66',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={15} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#752f66' }}>
                Version History
              </h3>
              <p style={{ margin: '1px 0 0 0', fontSize: '0.72rem', color: '#5d6785' }}>
                {versions.length} {versions.length === 1 ? 'version' : 'versions'} recorded
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            style={{ color: '#5d6785' }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Snapshot Bar / Create Snapshot Option */}
        <div style={{ padding: '10px 18px', borderBottom: '1px solid #edf2f6', background: '#ffffff' }}>
          {!isAddingSnapshot ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAddingSnapshot(true)}
              style={{
                width: '100%',
                justifyContent: 'center',
                gap: 6,
                fontWeight: 600,
                color: '#752f66',
                borderColor: '#f0dceb',
                background: '#faf4f8',
                fontSize: '0.78rem',
              }}
            >
              <Plus size={13} /> Name this version / Create Snapshot
            </button>
          ) : (
            <form onSubmit={handleCreateSnapshot} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Final client draft, Approved quote"
                value={snapshotSummary}
                onChange={(e) => setSnapshotSummary(e.target.value)}
                autoFocus
                style={{ fontSize: '0.8rem', padding: '6px 10px' }}
              />
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setIsAddingSnapshot(false);
                    setSnapshotSummary('');
                  }}
                  disabled={creatingSnapshot}
                  style={{ fontSize: '0.75rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={creatingSnapshot}
                  style={{ fontSize: '0.75rem', background: '#752f66' }}
                >
                  {creatingSnapshot ? 'Saving...' : 'Save Version'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Version Cards List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#5d6785', fontSize: '0.82rem' }}>
              <Clock size={20} className="loading-spinner" style={{ margin: '0 auto 6px auto' }} />
              <p>Loading version history...</p>
            </div>
          ) : versions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#5d6785', fontSize: '0.82rem' }}>
              <p>No historical versions recorded yet.</p>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Versions are automatically created when you save.
              </p>
            </div>
          ) : (
            versions.map((v) => {
              const isCurrent = v.versionNumber === currentVersionNumber;
              const isPreviewing = previewVersionId === v._id;

              return (
                <div
                  key={v._id}
                  onClick={() => {
                    onPreviewVersion(isPreviewing ? null : v);
                    onClose();
                  }}
                  style={{
                    border: isPreviewing
                      ? '2px solid #e47f25'
                      : isCurrent
                      ? '2px solid #752f66'
                      : '1px solid #edf2f6',
                    borderRadius: 10,
                    padding: '10px 12px',
                    backgroundColor: isPreviewing ? '#fffbf5' : isCurrent ? '#faf4f8' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow:
                      isPreviewing || isCurrent
                        ? '0 4px 12px rgba(117, 47, 102, 0.08)'
                        : '0 1px 3px rgba(0,0,0,0.02)',
                    position: 'relative',
                  }}
                >
                  {/* Version Number Header & Current Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          color: isCurrent ? '#752f66' : '#1c1e2d',
                        }}
                      >
                        {v.versionNumber}
                      </span>

                      {isCurrent && (
                        <span
                          style={{
                            background: '#752f66',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 10,
                            textTransform: 'uppercase',
                          }}
                        >
                          Current
                        </span>
                      )}

                      {isPreviewing && (
                        <span
                          style={{
                            background: '#e47f25',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 10,
                            textTransform: 'uppercase',
                          }}
                        >
                          Previewing
                        </span>
                      )}
                    </div>

                    {/* Delete button for historical versions */}
                    {versions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteVersion(v, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          padding: '3px',
                          cursor: 'pointer',
                          borderRadius: 4,
                        }}
                        title="Delete this version"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {/* Change Summary */}
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: isCurrent ? '#752f66' : '#334155',
                      marginBottom: 4,
                    }}
                  >
                    {v.changeSummary || 'Text updated'}
                  </div>

                  {/* Timestamp */}
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginBottom: !isCurrent ? 6 : 0,
                    }}
                  >
                    <Calendar size={11} color="#94a3b8" />
                    <span>{formatVersionDate(v.createdAt)}</span>
                  </div>

                  {/* Actions Row (Restore / Preview) */}
                  {!isCurrent && (
                    <div
                      style={{
                        marginTop: 6,
                        paddingTop: 6,
                        borderTop: '1px solid #edf2f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewVersion(isPreviewing ? null : v);
                          onClose();
                        }}
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 6px',
                          color: '#5d6785',
                          gap: 4,
                        }}
                      >
                        <Eye size={12} /> {isPreviewing ? 'Close Preview' : 'View on Canvas'}
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={(e) => handleRestore(v, e)}
                        disabled={restoringId === v._id}
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          background: '#752f66',
                          borderColor: '#752f66',
                          fontWeight: 600,
                          gap: 4,
                        }}
                      >
                        <RotateCcw size={11} />
                        {restoringId === v._id ? 'Restoring...' : 'Restore'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Bottom Info */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid #edf2f6',
            background: '#faf4f8',
            fontSize: '0.72rem',
            color: '#5d6785',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Sparkles size={13} color="#752f66" />
          <span>Restoring creates a new version without deleting history.</span>
        </div>
      </div>
    </div>
  );
};

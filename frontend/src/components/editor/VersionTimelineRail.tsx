import React, { useState, useEffect } from 'react';
import {
  History,
  RotateCcw,
  Trash2,
  Eye,
  Check,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { DocumentVersion } from '../../types/document.types.js';
import { versionApi } from '../../api/versionApi.js';
import { useToast } from '../../context/ToastContext.js';

interface VersionTimelineRailProps {
  documentId: string | null;
  currentVersionNumber: string;
  previewVersionId: string | null;
  onPreviewVersion: (version: DocumentVersion | null) => void;
  onRestoreVersion: (version: DocumentVersion) => Promise<void>;
  onOpenFullDrawer: () => void;
  refreshTrigger?: number;
}

const formatShortDate = (isoString?: string): string => {
  if (!isoString) return 'Just now';
  try {
    const d = new Date(isoString);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const time = d.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${day} ${month}, ${time}`;
  } catch (e) {
    return isoString;
  }
};

export const VersionTimelineRail: React.FC<VersionTimelineRailProps> = ({
  documentId,
  currentVersionNumber,
  previewVersionId,
  onPreviewVersion,
  onRestoreVersion,
  onOpenFullDrawer,
  refreshTrigger = 0,
}) => {
  const { success, error, info } = useToast();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [hoveredVersionId, setHoveredVersionId] = useState<string | null>(null);
  const [isRestoringId, setIsRestoringId] = useState<string | null>(null);

  const fetchVersions = async () => {
    if (!documentId) return;
    try {
      const res = await versionApi.getVersions(documentId);
      if (res.success && res.data.versions) {
        setVersions(res.data.versions);
      }
    } catch (err) {
      console.error('Failed to load versions for timeline rail:', err);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, [documentId, refreshTrigger, currentVersionNumber]);

  if (!documentId || versions.length === 0) {
    return null;
  }

  // Display versions from newest (top) to oldest (bottom)
  const sortedVersions = [...versions];

  const handleRestore = async (v: DocumentVersion, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Restore to ${v.versionNumber}? A new version will be created without deleting previous versions.`
      )
    ) {
      try {
        setIsRestoringId(v._id);
        await onRestoreVersion(v);
        await fetchVersions();
        success(`Restored document to ${v.versionNumber}!`);
      } catch (err) {
        error('Failed to restore version');
      } finally {
        setIsRestoringId(null);
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

  return (
    <aside
      className="version-timeline-rail no-print"
      style={{
        position: 'fixed',
        right: 24,
        top: 130,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #edf2f6',
        borderRadius: 20,
        padding: '16px 18px',
        boxShadow: '0 12px 36px rgba(28, 30, 45, 0.12)',
        width: 260,
        maxHeight: 'calc(100vh - 160px)',
      }}
      title="Version Timeline"
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 12,
          borderBottom: '1px solid #edf2f6',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <History size={16} color="#752f66" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#752f66' }}>
            Version Timeline
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenFullDrawer}
          style={{
            background: '#faf4f8',
            border: '1px solid #f0dceb',
            color: '#752f66',
            borderRadius: 6,
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '2px 8px',
            cursor: 'pointer',
          }}
          title="Open Drawer Panel"
        >
          View All ({versions.length})
        </button>
      </div>

      {/* Vertical Timeline List */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          paddingRight: 4,
          maxHeight: 'calc(100vh - 250px)',
        }}
      >
        {/* Continuous Vertical Connecting Line behind circles */}
        <div
          style={{
            position: 'absolute',
            left: 21,
            top: 22,
            bottom: 22,
            width: 2,
            backgroundColor: '#e2e8f0',
            zIndex: 1,
          }}
        />

        {sortedVersions.map((v) => {
          const isCurrent = v.versionNumber === currentVersionNumber;
          const isPreviewing = previewVersionId === v._id;
          const isHovered = hoveredVersionId === v._id;

          return (
            <div
              key={v._id}
              onClick={() => {
                if (isPreviewing) {
                  onPreviewVersion(null);
                } else {
                  onPreviewVersion(v);
                }
              }}
              onMouseEnter={() => setHoveredVersionId(v._id)}
              onMouseLeave={() => setHoveredVersionId(null)}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 6px',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: isPreviewing
                  ? '#fff7ed'
                  : isHovered
                  ? '#faf4f8'
                  : 'transparent',
              }}
            >
              {/* Left Circle Badge */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  minWidth: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  boxShadow: isCurrent
                    ? '0 0 0 4px rgba(117, 47, 102, 0.12)'
                    : isPreviewing
                    ? '0 0 0 4px rgba(228, 127, 37, 0.2)'
                    : 'none',
                  backgroundColor: isPreviewing
                    ? '#ffffff'
                    : isCurrent
                    ? '#752f66'
                    : '#752f66',
                  color: isPreviewing ? '#e47f25' : '#ffffff',
                  border: isPreviewing
                    ? '3px solid #e47f25'
                    : isCurrent
                    ? '3px solid #752f66'
                    : 'none',
                }}
              >
                {v.versionNumber}
              </div>

              {/* Right Side Text Labels */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Title / Change Summary */}
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: isCurrent ? '#752f66' : isPreviewing ? '#e47f25' : '#1c1e2d',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.25,
                  }}
                >
                  {v.changeSummary || 'Text updated'}
                </div>

                {/* Subtitle / Status & Date */}
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: isCurrent ? '#752f66' : isPreviewing ? '#e47f25' : '#64748b',
                    letterSpacing: '0.03em',
                    marginTop: 2,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {isCurrent ? (
                    <span style={{ color: '#752f66' }}>● CURRENT</span>
                  ) : isPreviewing ? (
                    <span style={{ color: '#e47f25' }}>● PREVIEWING</span>
                  ) : (
                    <span>{formatShortDate(v.createdAt)}</span>
                  )}
                </div>
              </div>

              {/* Hover Quick Actions */}
              {isHovered && !isCurrent && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => handleRestore(v, e)}
                    disabled={isRestoringId === v._id}
                    style={{
                      background: '#752f66',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: 6,
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '4px 6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                    title="Restore this version"
                  >
                    <RotateCcw size={11} />
                    {isRestoringId === v._id ? '...' : 'Restore'}
                  </button>

                  {versions.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteVersion(v, e)}
                      style={{
                        background: '#fee2e2',
                        border: 'none',
                        color: '#ef4444',
                        borderRadius: 6,
                        fontSize: '0.68rem',
                        padding: '4px 6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Delete this version"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

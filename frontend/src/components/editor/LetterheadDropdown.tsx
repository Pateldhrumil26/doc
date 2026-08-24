import React, { useState, useRef, useEffect } from 'react';
import {
  Layout,
  ChevronDown,
  Check,
  Plus,
  Building,
  XCircle,
  Edit2,
  Trash2,
} from 'lucide-react';
import {
  getSavedCompanyProfiles,
  saveCompanyProfiles,
  getActiveCompanyProfile,
  setActiveCompanyProfileId,
  fetchAndSyncBackendProfiles,
  CompanyProfile,
} from '../dashboard/CompanyProfileModal.js';
import { letterheadApi } from '../../api/letterheadApi.js';
import { useToast } from '../../context/ToastContext.js';

export interface LetterheadDropdownProps {
  currentProfileId: string | null;
  isLetterheadActive: boolean;
  onSelectProfile: (profile: CompanyProfile) => void;
  onOpenAddModal: (profileIdToEdit?: string | null) => void;
  onRemoveLetterhead: () => void;
}

export const LetterheadDropdown: React.FC<LetterheadDropdownProps> = ({
  currentProfileId,
  isLetterheadActive,
  onSelectProfile,
  onOpenAddModal,
  onRemoveLetterhead,
}) => {
  const { info, error } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profiles, setProfiles] = useState<CompanyProfile[]>(getSavedCompanyProfiles());

  const refreshList = async () => {
    const list = await fetchAndSyncBackendProfiles();
    setProfiles(list);
  };

  useEffect(() => {
    refreshList();
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeProfile =
    profiles.find((p) => p.id === currentProfileId) || getActiveCompanyProfile();

  const getTriggerLabel = () => {
    if (!isLetterheadActive) return 'Add Letterhead';
    return activeProfile ? activeProfile.name || activeProfile.companyName : 'Letterhead';
  };

  const handleDeleteProfile = async (id: string, name: string) => {
    if (profiles.length <= 1) {
      alert('You must keep at least one letterhead preset.');
      return;
    }
    if (confirm(`Are you sure you want to delete "${name}" preset?`)) {
      try {
        await letterheadApi.deleteProfile(id);
      } catch (e) {
        console.error('Delete from backend failed, updating locally:', e);
      }
      const updated = profiles.filter((p) => p.id !== id);
      setProfiles(updated);
      saveCompanyProfiles(updated);
      info(`Deleted "${name}" preset.`);
    }
  };

  return (
    <div
      className={`custom-dropdown-container ${isOpen ? 'menu-open' : ''}`}
      ref={dropdownRef}
      style={{ position: 'relative' }}
    >
      <button
        type="button"
        className={`custom-dropdown-trigger ${isLetterheadActive ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          color: isLetterheadActive ? '#752f66' : '#5d6785',
          background: isLetterheadActive ? '#faf4f8' : '#ffffff',
          borderColor: isLetterheadActive ? '#f0dceb' : '#dbe2ea',
          fontWeight: 600,
          padding: '4px 10px',
        }}
        title="Select from saved Header & Footer presets or add new"
      >
        <div className="dropdown-trigger-content">
          <Layout size={14} color={isLetterheadActive ? '#752f66' : '#5d6785'} />
          <span className="dropdown-trigger-label" style={{ fontSize: '0.785rem', maxWidth: 170, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {getTriggerLabel()}
          </span>
        </div>
        <ChevronDown size={13} className={`dropdown-chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="custom-dropdown-menu align-right"
          style={{
            minWidth: 280,
            padding: '6px 0',
            borderRadius: 12,
            boxShadow: '0 14px 32px rgba(28, 30, 45, 0.14)',
            zIndex: 3000,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ padding: '6px 14px 6px 14px', borderBottom: '1px solid #edf2f6' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Header & Footer Presets ({profiles.length})
            </div>
          </div>

          {/* List of all saved Header & Footer Profiles with direct Edit & Delete buttons */}
          <div style={{ padding: '4px 0', maxHeight: 250, overflowY: 'auto' }}>
            {profiles.map((p) => {
              const isSelected = isLetterheadActive && p.id === activeProfile.id;
              return (
                <div
                  key={p.id}
                  className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveCompanyProfileId(p.id);
                    onSelectProfile(p);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div className="dropdown-item-content" style={{ flex: 1, minWidth: 0 }}>
                    <span className="dropdown-item-icon">
                      <Building size={15} color={isSelected ? '#752f66' : '#5d6785'} />
                    </span>
                    <div className="dropdown-item-text" style={{ flex: 1, minWidth: 0 }}>
                      <span className="dropdown-item-label" style={{ fontWeight: isSelected ? 700 : 600 }}>
                        {p.name || p.companyName}
                      </span>
                      <span className="dropdown-item-desc" style={{ fontSize: '0.72rem' }}>
                        {p.companyName}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {isSelected && <Check size={14} color="#752f66" style={{ marginRight: 2 }} />}

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        onOpenAddModal(p.id);
                      }}
                      title="Edit details"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        color: '#752f66',
                        cursor: 'pointer',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Edit2 size={13} />
                    </button>

                    {/* Delete button */}
                    {profiles.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProfile(p.id, p.name || p.companyName);
                        }}
                        title="Delete preset"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          borderRadius: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div style={{ borderTop: '1px solid #edf2f6', padding: '6px 8px 2px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Button 1: Add New Header & Footer */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenAddModal(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '7px 10px',
                borderRadius: 6,
                border: 'none',
                background: '#faf4f8',
                color: '#752f66',
                fontSize: '0.785rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Plus size={14} color="#752f66" />
              <span>+ Add New Header & Footer...</span>
            </button>

            {/* Button 2: Remove Letterhead */}
            {isLetterheadActive && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onRemoveLetterhead();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: '#ef4444',
                  fontSize: '0.785rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <XCircle size={13} color="#ef4444" />
                <span>Remove Letterhead</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

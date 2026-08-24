import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Check,
  Edit2,
  Trash2,
  Building,
  XCircle,
  Phone,
  Mail,
  Globe,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';
import {
  getSavedCompanyProfiles,
  saveCompanyProfiles,
  setActiveCompanyProfileId,
  CompanyProfile,
} from '../dashboard/CompanyProfileModal.js';
import { useToast } from '../../context/ToastContext.js';

interface LetterheadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfileId: string | null;
  isLetterheadActive: boolean;
  onSelectProfile: (profile: CompanyProfile) => void;
  onOpenAddModal: (profileIdToEdit?: string | null) => void;
  onRemoveLetterhead: () => void;
}

export const LetterheadDrawer: React.FC<LetterheadDrawerProps> = ({
  isOpen,
  onClose,
  currentProfileId,
  isLetterheadActive,
  onSelectProfile,
  onOpenAddModal,
  onRemoveLetterhead,
}) => {
  const { success, info } = useToast();
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);

  const refreshList = () => {
    setProfiles(getSavedCompanyProfiles());
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteProfile = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      alert('You must keep at least one letterhead preset.');
      return;
    }
    if (confirm(`Are you sure you want to remove "${name}" preset?`)) {
      const updated = profiles.filter((p) => p.id !== id);
      setProfiles(updated);
      saveCompanyProfiles(updated);
      info(`Removed "${name}" preset.`);
    }
  };

  return (
    <div
      className="letterhead-drawer-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="letterhead-drawer-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-8px 0 32px rgba(28, 30, 45, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Top Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #edf2f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#faf4f8',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#752f66' }}>
              Header & Footer Presets
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#5d6785' }}>
              Select any preset below to apply instantly to your document
            </p>
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

        {/* Add New Preset Action */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #edf2f6' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onOpenAddModal(null);
            }}
            style={{
              width: '100%',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #752f66 0%, #e47f25 100%)',
              borderColor: 'transparent',
              fontWeight: 600,
              gap: 8,
              padding: '10px 16px',
            }}
          >
            <Plus size={16} /> + Add Custom Header & Footer
          </button>
        </div>

        {/* Presets List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {profiles.map((p) => {
            const isSelected = isLetterheadActive && p.id === currentProfileId;

            return (
              <div
                key={p.id}
                onClick={() => {
                  setActiveCompanyProfileId(p.id);
                  onSelectProfile(p);
                }}
                style={{
                  border: isSelected ? '2px solid #752f66' : '1px solid #edf2f6',
                  borderRadius: 12,
                  padding: 14,
                  backgroundColor: isSelected ? '#faf4f8' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(117, 47, 102, 0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
                  position: 'relative',
                }}
              >
                {/* Title Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: isSelected ? '#752f66' : '#edf2f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? '#fff' : '#752f66' }}>
                    <Building size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isSelected ? '#752f66' : '#1c1e2d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name || p.companyName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#5d6785' }}>
                      {p.companyName}
                    </div>
                  </div>
                </div>

                {/* Details Box */}
                <div style={{ background: '#ffffff', borderRadius: 8, padding: '8px 10px', fontSize: '0.75rem', color: '#5d6785', display: 'flex', flexDirection: 'column', gap: 4, border: '1px solid #edf2f6', marginBottom: 10 }}>
                  {p.logo && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ImageIcon size={12} color="#752f66" />
                      <span style={{ fontWeight: 600, color: '#1c1e2d' }}>Custom Logo Attached</span>
                    </div>
                  )}
                  {p.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Phone size={12} color="#e47f25" />
                      <span>{p.phone}</span>
                    </div>
                  )}
                  {p.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Mail size={12} color="#752f66" />
                      <span>{p.email}</span>
                    </div>
                  )}
                  {p.website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Globe size={12} color="#752f66" />
                      <span>{p.website}</span>
                    </div>
                  )}
                  {p.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={12} color="#5d6785" />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.address}</span>
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 14px',
                      fontWeight: 600,
                      backgroundColor: isSelected ? '#752f66' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#752f66',
                      borderColor: '#f0dceb',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCompanyProfileId(p.id);
                      onSelectProfile(p);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check size={13} /> Active On Document
                      </>
                    ) : (
                      'Select & Apply'
                    )}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAddModal(p.id);
                      }}
                      title="Edit this preset"
                      style={{ color: '#752f66', padding: '4px 8px' }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>

                    {profiles.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={(e) => handleDeleteProfile(p.id, p.name || p.companyName, e)}
                        title="Remove this preset"
                        style={{ color: '#ef4444', padding: '4px 8px' }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Drawer Footer */}
        {isLetterheadActive && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid #edf2f6', background: '#faf4f8' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                onRemoveLetterhead();
                onClose();
              }}
              style={{
                width: '100%',
                justifyContent: 'center',
                color: '#ef4444',
                borderColor: '#fecaca',
                background: '#fff',
                fontSize: '0.825rem',
                fontWeight: 600,
                gap: 6,
              }}
            >
              <XCircle size={15} /> Remove Letterhead from Canvas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

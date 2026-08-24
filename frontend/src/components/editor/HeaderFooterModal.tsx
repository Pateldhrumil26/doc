import React, { useState } from 'react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { Dropdown } from '../common/Dropdown.js';
import { DocFooter, DocHeader, FooterLayout, HeaderLayout } from '../../types/document.types.js';
import { Building, Phone, Mail, Globe, Image as ImageIcon, MapPin, Sparkles, Trash2, Check } from 'lucide-react';
import { getSavedCompanyProfile } from '../dashboard/CompanyProfileModal.js';

interface HeaderFooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: DocHeader;
  footer: DocFooter;
  onSave: (data: { header: DocHeader; footer: DocFooter }) => void;
}

export const HeaderFooterModal: React.FC<HeaderFooterModalProps> = ({
  isOpen,
  onClose,
  header: initialHeader,
  footer: initialFooter,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  const [header, setHeader] = useState<DocHeader>(initialHeader || { enabled: true, layout: 'aesthetic' });
  const [footer, setFooter] = useState<DocFooter>(initialFooter || { enabled: true, layout: 'aesthetic' });

  const handleApplySavedProfile = () => {
    const saved = getSavedCompanyProfile();
    setHeader((prev) => ({
      ...prev,
      enabled: true,
      companyName: saved.companyName || 'Aesthetic Arc Studio',
      logo: saved.logo || prev.logo,
      layout: prev.layout || 'aesthetic',
    }));
    setFooter((prev) => ({
      ...prev,
      enabled: true,
      phone: saved.phone,
      email: saved.email,
      website: saved.website,
      address: saved.address,
      layout: prev.layout || 'aesthetic',
    }));
  };

  const handleClearLetterhead = () => {
    setHeader((prev) => ({
      ...prev,
      enabled: false,
      logo: '',
      companyName: '',
    }));
    setFooter((prev) => ({
      ...prev,
      enabled: false,
      phone: '',
      email: '',
      website: '',
      address: '',
      customText: '',
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setHeader((prev) => ({ ...prev, logo: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ header, footer });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Header & Footer Settings"
      maxWidth="640px"
    >
      {/* Quick 1-Click Profile Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#eff6ff',
          border: '1px solid #dbeafe',
          padding: '10px 14px',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color="#2563eb" />
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1e40af' }}>
            Quick Setup with Saved Profile
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleApplySavedProfile}
            style={{ fontSize: '0.775rem', fontWeight: 600, color: '#2563eb' }}
          >
            Apply Saved Profile
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleClearLetterhead}
            style={{ fontSize: '0.775rem', color: '#ef4444' }}
          >
            Remove / Clear
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
        <button
          type="button"
          className={`btn btn-ghost btn-sm ${activeTab === 'header' ? 'active' : ''}`}
          style={{
            borderBottom: activeTab === 'header' ? '2px solid #2563eb' : 'none',
            borderRadius: '4px 4px 0 0',
            fontWeight: 600,
          }}
          onClick={() => setActiveTab('header')}
        >
          Header: Company Logo
        </button>
        <button
          type="button"
          className={`btn btn-ghost btn-sm ${activeTab === 'footer' ? 'active' : ''}`}
          style={{
            borderBottom: activeTab === 'footer' ? '2px solid #2563eb' : 'none',
            borderRadius: '4px 4px 0 0',
            fontWeight: 600,
          }}
          onClick={() => setActiveTab('footer')}
        >
          Footer: Mobile, Email, Website & Address
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'header' ? (
          <div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={header.enabled}
                  onChange={(e) => setHeader((prev) => ({ ...prev, enabled: e.target.checked }))}
                  style={{ width: 18, height: 18 }}
                />
                <strong style={{ fontSize: '0.95rem' }}>Enable Header on Document</strong>
              </label>
            </div>

            {header.enabled && (
              <>
                <div className="form-group">
                  <label>Header Layout Style</label>
                  <Dropdown
                    value={header.layout || 'aesthetic'}
                    onChange={(val) =>
                      setHeader((prev) => ({
                        ...prev,
                        layout: val as HeaderLayout,
                      }))
                    }
                    options={[
                      { value: 'aesthetic', label: 'Aesthetic Arc (Gradient Ribbon Bar)', description: 'Modern top gradient band' },
                      { value: 'classic', label: 'Classic Letterhead (Logo Left)', description: 'Clean left aligned logo' },
                      { value: 'centered', label: 'Centered Emblem', description: 'Formal centered emblem' },
                      { value: 'minimal', label: 'Minimal Top Bar', description: 'Clean streamlined top line' },
                    ]}
                  />
                </div>

                <div className="form-group">
                  <label>Company Logo Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {header.logo && (
                      <img
                        src={header.logo}
                        alt="Logo Preview"
                        style={{
                          height: 52,
                          maxWidth: 160,
                          objectFit: 'contain',
                          border: '1px solid #e2e8f0',
                          padding: 6,
                          borderRadius: 6,
                          background: '#fff',
                        }}
                      />
                    )}
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                      <ImageIcon size={14} /> {header.logo ? 'Change Logo' : 'Upload Logo Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {header.logo && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setHeader((prev) => ({ ...prev, logo: '' }))}
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Company / Brand Name (Optional fallback)</label>
                  <div className="input-with-icon">
                    <Building size={16} className="field-icon" />
                    <input
                      type="text"
                      className="form-input icon-input"
                      placeholder="e.g. Aesthetic Arc Studio"
                      value={header.companyName || ''}
                      onChange={(e) =>
                        setHeader((prev) => ({ ...prev, companyName: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={footer.enabled}
                  onChange={(e) => setFooter((prev) => ({ ...prev, enabled: e.target.checked }))}
                  style={{ width: 18, height: 18 }}
                />
                <strong style={{ fontSize: '0.95rem' }}>Enable Footer on Document</strong>
              </label>
            </div>

            {footer.enabled && (
              <>
                <div className="form-group">
                  <label>Footer Layout Style</label>
                  <Dropdown
                    value={footer.layout || 'aesthetic'}
                    onChange={(val) =>
                      setFooter((prev) => ({
                        ...prev,
                        layout: val as FooterLayout,
                      }))
                    }
                    options={[
                      { value: 'aesthetic', label: 'Aesthetic Arc (Waves + Skyline + Contact Badges)', description: 'Full designer graphic footer' },
                      { value: 'split', label: 'Split (Address Left, Contacts Right)' },
                      { value: 'centered', label: 'Centered Contact Line' },
                      { value: 'simple', label: 'Simple Page Number Only' },
                    ]}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone / Mobile</label>
                    <div className="input-with-icon">
                      <Phone size={16} className="field-icon" />
                      <input
                        type="text"
                        className="form-input icon-input"
                        placeholder="+91 9825 0201 73"
                        value={footer.phone || ''}
                        onChange={(e) =>
                          setFooter((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <div className="input-with-icon">
                      <Mail size={16} className="field-icon" />
                      <input
                        type="email"
                        className="form-input icon-input"
                        placeholder="connect@company.com"
                        value={footer.email || ''}
                        onChange={(e) =>
                          setFooter((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <div className="input-with-icon">
                    <Globe size={16} className="field-icon" />
                    <input
                      type="text"
                      className="form-input icon-input"
                      placeholder="aestheticarc.com"
                      value={footer.website || ''}
                      onChange={(e) =>
                        setFooter((prev) => ({ ...prev, website: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Office Address</label>
                  <div className="input-with-icon">
                    <MapPin size={16} className="field-icon" />
                    <input
                      type="text"
                      className="form-input icon-input"
                      placeholder="504, Venus Atlantis Corporate Park, 100ft Road, Prahlad Nagar, Satellite, Ahmedabad - 380015, India"
                      value={footer.address || ''}
                      onChange={(e) =>
                        setFooter((prev) => ({ ...prev, address: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Apply to Document
          </Button>
        </div>
      </form>
    </Modal>
  );
};

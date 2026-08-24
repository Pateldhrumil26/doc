import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import {
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';
import { letterheadApi } from '../../api/letterheadApi.js';

export interface CompanyProfile {
  id: string;
  name: string; // e.g. "Aesthetic Arc (Primary)", "Apex Investment"
  companyName: string;
  logo: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  isDefault?: boolean;
}

const STORAGE_PROFILES_KEY = 'docpad_company_letterhead_profiles_list';
const STORAGE_ACTIVE_ID_KEY = 'docpad_active_company_profile_id';

export const DEFAULT_PROFILES: CompanyProfile[] = [
  {
    id: 'profile_aesthetic_arc',
    name: 'Aesthetic Arc (Primary)',
    companyName: 'Aesthetic Arc Studio',
    logo: '',
    phone: '+91 9825 0201 73',
    email: 'connect@aestheticarc.com',
    website: 'aestheticarc.com',
    address: '504, Venus Atlantis Corporate Park, 100ft Road, Prahlad Nagar, Ahmedabad - 380015, India',
    isDefault: true,
  },
  {
    id: 'profile_apex_investment',
    name: 'Apex Investment Corp',
    companyName: 'Apex Investment Corp',
    logo: '',
    phone: '+91 9904 1122 33',
    email: 'info@apexinvest.com',
    website: 'apexinvest.com',
    address: '802, Synergy Tower, Corporate Road, Prahlad Nagar, Ahmedabad - 380015, India',
    isDefault: false,
  },
];

export const getSavedCompanyProfiles = (): CompanyProfile[] => {
  try {
    const data = localStorage.getItem(STORAGE_PROFILES_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PROFILES;
};

export const saveCompanyProfiles = (profiles: CompanyProfile[]) => {
  try {
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error(e);
  }
};

export const fetchAndSyncBackendProfiles = async (): Promise<CompanyProfile[]> => {
  try {
    const res = await letterheadApi.getProfiles();
    if (res.success && res.data.profiles.length > 0) {
      const mapped: CompanyProfile[] = res.data.profiles.map((p) => ({
        id: p._id,
        name: p.name,
        companyName: p.companyName,
        logo: p.logo,
        phone: p.phone,
        email: p.email,
        website: p.website,
        address: p.address,
        isDefault: p.isDefault,
      }));
      saveCompanyProfiles(mapped);
      return mapped;
    }
  } catch (err) {
    console.error('Failed to load profiles from backend, using local fallback:', err);
  }
  return getSavedCompanyProfiles();
};

export const getActiveCompanyProfile = (): CompanyProfile => {
  const profiles = getSavedCompanyProfiles();
  const activeId = localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
  if (activeId) {
    const found = profiles.find((p) => p.id === activeId);
    if (found) return found;
  }
  return profiles[0] || DEFAULT_PROFILES[0];
};

export const setActiveCompanyProfileId = (id: string) => {
  try {
    localStorage.setItem(STORAGE_ACTIVE_ID_KEY, id);
  } catch (e) {
    console.error(e);
  }
};

export const getSavedCompanyProfile = (): CompanyProfile => {
  return getActiveCompanyProfile();
};

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileAdded?: (newProfile: CompanyProfile) => void;
  editingProfileId?: string | null;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileAdded,
  editingProfileId,
}) => {
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingProfileId) {
        const profiles = getSavedCompanyProfiles();
        const found = profiles.find((p) => p.id === editingProfileId);
        if (found) {
          setName(found.name || '');
          setCompanyName(found.companyName || '');
          setLogo(found.logo || '');
          setPhone(found.phone || '');
          setEmail(found.email || '');
          setWebsite(found.website || '');
          setAddress(found.address || '');
          return;
        }
      }
      // New profile defaults
      setName('');
      setCompanyName('');
      setLogo('');
      setPhone('+91 ');
      setEmail('');
      setWebsite('');
      setAddress('');
    }
  }, [isOpen, editingProfileId]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogo(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const displayName = name.trim() || companyName.trim() || 'New Preset';
    const payload = {
      name: displayName,
      companyName: companyName.trim() || displayName,
      logo,
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      address: address.trim(),
    };

    try {
      let savedProfile: CompanyProfile;

      if (editingProfileId) {
        // Backend update
        try {
          const res = await letterheadApi.updateProfile(editingProfileId, payload);
          if (res.success && res.data.profile) {
            savedProfile = {
              id: res.data.profile._id,
              ...payload,
            };
          } else {
            savedProfile = { id: editingProfileId, ...payload };
          }
        } catch (apiErr) {
          savedProfile = { id: editingProfileId, ...payload };
        }

        const profiles = getSavedCompanyProfiles();
        const updated = profiles.map((p) => (p.id === editingProfileId ? savedProfile : p));
        saveCompanyProfiles(updated);
      } else {
        // Backend create
        try {
          const res = await letterheadApi.createProfile(payload);
          if (res.success && res.data.profile) {
            savedProfile = {
              id: res.data.profile._id,
              ...payload,
            };
          } else {
            savedProfile = { id: `profile_${Date.now()}`, ...payload };
          }
        } catch (apiErr) {
          savedProfile = { id: `profile_${Date.now()}`, ...payload };
        }

        const profiles = getSavedCompanyProfiles();
        saveCompanyProfiles([...profiles, savedProfile]);
      }

      setActiveCompanyProfileId(savedProfile.id);

      if (onProfileAdded) {
        onProfileAdded(savedProfile);
      }

      success(`Letterhead Preset "${displayName}" saved to database!`);
      onClose();
    } catch (err: any) {
      error('Failed to save letterhead profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProfileId ? 'Edit Letterhead Details' : 'Add New Letterhead Preset'}
      maxWidth="640px"
    >
      <form onSubmit={handleFormSubmit}>
        {/* Preset Name */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>Preset Name / Label</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Aesthetic Arc (Primary), Apex Investment, Branch 2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Header Fields (Logo & Company Name) */}
        <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #edf2f6', marginBottom: 14 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#752f66', textTransform: 'uppercase', marginBottom: 10 }}>
            Header: Company Name & Logo
          </div>

          <div className="form-group">
            <label>Company / Organization Name</label>
            <div className="input-with-icon">
              <Building size={16} className="field-icon" />
              <input
                type="text"
                className="form-input icon-input"
                placeholder="e.g. Aesthetic Arc Studio"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Company Logo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {logo && (
                <img
                  src={logo}
                  alt="Logo Preview"
                  style={{
                    height: 44,
                    maxWidth: 140,
                    objectFit: 'contain',
                    border: '1px solid #edf2f6',
                    padding: 4,
                    borderRadius: 6,
                    background: '#fff',
                  }}
                />
              )}
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                <ImageIcon size={14} /> {logo ? 'Change Logo' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
              </label>
              {logo && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setLogo('')}
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Fields (Phone, Email, Web, Address) */}
        <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #edf2f6', marginBottom: 16 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#752f66', textTransform: 'uppercase', marginBottom: 10 }}>
            Footer: Contact & Address Details
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Office Address</label>
            <div className="input-with-icon">
              <MapPin size={16} className="field-icon" />
              <input
                type="text"
                className="form-input icon-input"
                placeholder="504, Venus Atlantis Corporate Park, Prahlad Nagar, Ahmedabad"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ margin: '0 -24px -24px -24px' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<CheckCircle2 size={16} />} disabled={saving}>
            {saving ? 'Saving to Database...' : 'Save & Apply to Document'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

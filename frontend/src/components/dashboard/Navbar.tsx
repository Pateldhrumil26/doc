import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Sparkles } from 'lucide-react';
import { CompanyProfileModal } from './CompanyProfileModal.js';
import { CompanyProfileDropdown } from './CompanyProfileDropdown.js';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNewDocument?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  const handleOpenManageModal = (profileIdToEdit?: string | null) => {
    setEditingProfileId(profileIdToEdit || null);
    setIsProfileModalOpen(true);
  };

  return (
    <>
      <header className="dashboard-navbar">
        <div className="navbar-left">
          <div className="navbar-logo" onClick={() => navigate('/dashboard')}>
            <div className="logo-icon">
              <FileText size={20} />
            </div>
            <div className="logo-text">
              <span className="brand-name">DocPad</span>
              <span className="brand-sub">Studio</span>
            </div>
          </div>
        </div>

        <div className="navbar-center">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="dashboard-search-input"
              placeholder="Search documents by title..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => onSearchChange('')}>
                ×
              </button>
            )}
          </div>
        </div>

        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Profile Dropdown */}
          <CompanyProfileDropdown onOpenManageModal={handleOpenManageModal} />

          <div
            className="company-badge"
            style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}
          >
            <Sparkles size={14} />
            <span>Open Source</span>
          </div>
        </div>
      </header>

      <CompanyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        editingProfileId={editingProfileId}
      />
    </>
  );
};

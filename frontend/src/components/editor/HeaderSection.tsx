import React from 'react';
import { DocHeader } from '../../types/document.types.js';

interface HeaderSectionProps {
  header: DocHeader;
  onEdit: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ header, onEdit }) => {
  if (!header || !header.enabled) return null;

  return (
    <header
      className="document-header-area header-aesthetic"
      onDoubleClick={onEdit}
      title="Company letterhead header"
    >
      <div className="aesthetic-header-container" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {header.logo ? (
              <img
                src={header.logo}
                alt="Company Logo"
                className="header-logo-img"
                style={{ maxHeight: 52, maxWidth: 220, objectFit: 'contain' }}
              />
            ) : (
              <div className="aesthetic-logo-wrapper">
                <div className="aesthetic-brand-title">
                  <span className="brand-word-1">
                    {header.companyName ? header.companyName.split(' ')[0] : 'AESTHETIC'}
                  </span>{' '}
                  <span className="brand-word-2">
                    {header.companyName && header.companyName.split(' ').length > 1
                      ? header.companyName.split(' ').slice(1).join(' ')
                      : 'ARC'}
                  </span>
                  <svg
                    className="aesthetic-arc-svg"
                    viewBox="0 0 100 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 28C25 10 70 5 95 24C78 12 40 12 18 30Z"
                      fill="url(#arcGradientHeader)"
                    />
                    <defs>
                      <linearGradient id="arcGradientHeader" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#e47f25" />
                        <stop offset="50%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#752f66" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full Bleed Top Gradient Ribbon */}
        <div className="aesthetic-header-gradient-bar" />
      </div>
    </header>
  );
};

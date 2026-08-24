import React from 'react';
import { DocFooter } from '../../types/document.types.js';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';

interface FooterSectionProps {
  footer: DocFooter;
  onEdit: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ footer, onEdit }) => {
  if (!footer || !footer.enabled) return null;

  return (
    <footer
      className="document-footer-area footer-aesthetic"
      onDoubleClick={onEdit}
      title="Company letterhead footer"
    >
      <div className="aesthetic-footer-wrapper">
        {/* Bottom Left Multi-Color Curved Wave Vector */}
        <div className="aesthetic-corner-wave">
          <svg
            viewBox="0 0 400 180"
            preserveAspectRatio="none"
            className="aesthetic-wave-svg"
          >
            <path
              d="M 0,0 C 80,40 160,110 240,180 L 0,180 Z"
              fill="#e47f25"
            />
            <path
              d="M 0,15 C 70,55 140,120 210,180 L 0,180 Z"
              fill="#9333ea"
            />
            <path
              d="M 0,35 C 60,70 120,130 180,180 L 0,180 Z"
              fill="#752f66"
            />
          </svg>
        </div>

        {/* Bottom Right City Landmark Skyline Art */}
        <div className="aesthetic-skyline-container">
          <svg
            viewBox="0 0 220 160"
            className="aesthetic-skyline-svg"
            fill="none"
            stroke="#752f66"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="10" y="110" width="36" height="48" rx="2" />
            <path d="M 16,158 L 16,130 Q 28,120 40,130 L 40,158" />
            <line x1="12" y1="120" x2="44" y2="120" />
            <rect x="18" y="113" width="5" height="5" />
            <rect x="26" y="113" width="5" height="5" />
            <rect x="34" y="113" width="5" height="5" />
            <circle cx="56" cy="138" r="7" strokeDasharray="2 2" />
            <line x1="56" y1="145" x2="56" y2="158" />
            <rect x="68" y="70" width="22" height="88" rx="3" />
            <line x1="72" y1="78" x2="72" y2="150" />
            <line x1="79" y1="78" x2="79" y2="150" />
            <line x1="86" y1="78" x2="86" y2="150" />
            <path d="M 68,70 Q 79,56 90,70" />
            <rect x="94" y="92" width="20" height="66" rx="4" />
            <line x1="98" y1="98" x2="98" y2="150" />
            <line x1="104" y1="98" x2="104" y2="150" />
            <line x1="110" y1="98" x2="110" y2="150" />
            <path d="M 94,92 Q 104,78 114,92" />
            <line x1="104" y1="78" x2="104" y2="68" />
            <rect x="120" y="50" width="24" height="108" rx="2" />
            <line x1="124" y1="58" x2="124" y2="150" />
            <line x1="128" y1="58" x2="128" y2="150" />
            <line x1="132" y1="58" x2="132" y2="150" />
            <line x1="136" y1="58" x2="136" y2="150" />
            <line x1="140" y1="58" x2="140" y2="150" />
            <path d="M 120,50 L 132,30 L 144,50 Z" />
            <line x1="132" y1="30" x2="132" y2="15" />
            <circle cx="132" cy="15" r="1.5" />
            <rect x="148" y="95" width="18" height="63" rx="2" />
            <line x1="152" y1="100" x2="152" y2="150" />
            <line x1="157" y1="100" x2="157" y2="150" />
            <line x1="162" y1="100" x2="162" y2="150" />
            <path d="M 148,95 L 157,80 L 166,95 Z" />
            <line x1="157" y1="80" x2="157" y2="72" />
            <circle cx="178" cy="138" r="7" strokeDasharray="2 2" />
            <line x1="178" y1="145" x2="178" y2="158" />
            <line x1="0" y1="158" x2="220" y2="158" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Contact Details Center-Left */}
        <div className="aesthetic-footer-content">
          <div className="aesthetic-contact-row">
            {footer.phone && (
              <div className="aesthetic-contact-item">
                <span className="aesthetic-icon-circle">
                  <Phone size={11} />
                </span>
                <span>{footer.phone}</span>
              </div>
            )}

            {footer.phone && footer.email && <span className="aesthetic-contact-sep">|</span>}

            {footer.email && (
              <div className="aesthetic-contact-item">
                <span className="aesthetic-icon-circle">
                  <Mail size={11} />
                </span>
                <span>{footer.email}</span>
              </div>
            )}

            {footer.email && footer.website && <span className="aesthetic-contact-sep">|</span>}

            {footer.website && (
              <div className="aesthetic-contact-item">
                <span className="aesthetic-icon-circle">
                  <Globe size={11} />
                </span>
                <span>{footer.website}</span>
              </div>
            )}
          </div>

          {/* Address Row */}
          {footer.address && (
            <div className="aesthetic-address-row">
              <span className="aesthetic-icon-circle address-icon">
                <MapPin size={12} />
              </span>
              <span>{footer.address}</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

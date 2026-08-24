import React from 'react';
import { LetterpadConfig } from '../../types/document.types.js';

interface LetterpadMetaSectionProps {
  config: LetterpadConfig;
  onEdit: () => void;
}

export const LetterpadMetaSection: React.FC<LetterpadMetaSectionProps> = ({
  config,
  onEdit,
}) => {
  if (!config || !config.isLetterpadMode) return null;

  return (
    <div
      className="letterpad-meta-container"
      onDoubleClick={onEdit}
      title="Double click to configure letter pad reference, recipient, and signature"
      style={{ cursor: 'pointer' }}
    >
      <div className="letterpad-meta-grid">
        <div className="letterpad-ref-date">
          {config.refNo && (
            <div>
              <strong>Ref. No:</strong> {config.refNo}
            </div>
          )}
          {config.recipientName && (
            <div className="letterpad-recipient">
              <div>
                <strong>To:</strong>
              </div>
              <div style={{ fontWeight: 600 }}>{config.recipientName}</div>
              {config.recipientDesignation && <div>{config.recipientDesignation}</div>}
              {config.recipientOrg && <div>{config.recipientOrg}</div>}
              {config.recipientAddress && (
                <div style={{ color: '#475569', fontSize: '0.825rem' }}>
                  {config.recipientAddress}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          {config.date && (
            <div>
              <strong>Date:</strong> {config.date}
            </div>
          )}
        </div>
      </div>

      {config.subject && (
        <div className="letterpad-subject-bar">
          <span>SUBJECT: </span>
          <span style={{ textDecoration: 'underline' }}>{config.subject}</span>
        </div>
      )}
    </div>
  );
};

export const LetterpadSignatorySection: React.FC<LetterpadMetaSectionProps> = ({
  config,
  onEdit,
}) => {
  if (!config || !config.isLetterpadMode) return null;

  const hasSignatory =
    config.regardsName ||
    config.regardsDesignation ||
    config.signatureImage ||
    config.stampImage;

  if (!hasSignatory) return null;

  return (
    <div
      className="letterpad-sign-block"
      onDoubleClick={onEdit}
      title="Double click to configure signatory"
      style={{ cursor: 'pointer', marginTop: 32 }}
    >
      <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: 6 }}>
        Yours sincerely,
      </div>

      {config.signatureImage && (
        <img
          src={config.signatureImage}
          alt="Signature"
          className="signature-preview-img"
        />
      )}

      {config.stampImage && (
        <img src={config.stampImage} alt="Official Stamp" className="stamp-preview-img" />
      )}

      {config.regardsName && (
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
          {config.regardsName}
        </div>
      )}

      {config.regardsDesignation && (
        <div style={{ fontSize: '0.825rem', color: '#475569' }}>
          {config.regardsDesignation}
        </div>
      )}

      {config.regardsOrg && (
        <div style={{ fontSize: '0.825rem', color: '#64748b' }}>{config.regardsOrg}</div>
      )}
    </div>
  );
};

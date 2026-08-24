import React, { useState } from 'react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { LetterpadConfig } from '../../types/document.types.js';
import { Stamp, UserCheck, Calendar, FileText, Image as ImageIcon } from 'lucide-react';

interface LetterpadConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LetterpadConfig;
  onSave: (config: LetterpadConfig) => void;
}

export const LetterpadConfigModal: React.FC<LetterpadConfigModalProps> = ({
  isOpen,
  onClose,
  config: initialConfig,
  onSave,
}) => {
  const [config, setConfig] = useState<LetterpadConfig>(
    initialConfig || {
      isLetterpadMode: true,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }
  );

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'signatureImage' | 'stampImage'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setConfig((prev) => ({ ...prev, [field]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Letter Pad Structure & Letterhead Format"
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.isLetterpadMode}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, isLetterpadMode: e.target.checked }))
              }
              style={{ width: 18, height: 18 }}
            />
            <strong style={{ fontSize: '0.95rem' }}>
              Enable Letter Pad Structured Header & Signatory Fields
            </strong>
          </label>
        </div>

        {config.isLetterpadMode && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FileText size={14} style={{ marginRight: 4 }} /> Reference Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. REF/ACME/2026/0129"
                  value={config.refNo || ''}
                  onChange={(e) => setConfig((prev) => ({ ...prev, refNo: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={14} style={{ marginRight: 4 }} /> Letter Date
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. August 24, 2026"
                  value={config.date || ''}
                  onChange={(e) => setConfig((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, margin: '10px 0 16px 0', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: 10 }}>
                Recipient Details (To:)
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mr. Alexander Wright"
                    value={config.recipientName || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, recipientName: e.target.value }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Recipient Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Chief Technology Officer"
                    value={config.recipientDesignation || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, recipientDesignation: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Organization / Company</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Vanguard Global Enterprise"
                    value={config.recipientOrg || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, recipientOrg: e.target.value }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Recipient Address / Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 100 Broadway, 18th Floor, New York, NY"
                    value={config.recipientAddress || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, recipientAddress: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Subject Line</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Formal Letter of Engagement & Partnership Memorandum"
                value={config.subject || ''}
                onChange={(e) => setConfig((prev) => ({ ...prev, subject: e.target.value }))}
              />
            </div>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, margin: '14px 0', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: 10 }}>
                Signatory & Stamp (Regards)
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Signatory Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sarah Jenkins"
                    value={config.regardsName || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, regardsName: e.target.value }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Managing Director"
                    value={config.regardsDesignation || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, regardsDesignation: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-row" style={{ marginTop: 8 }}>
                <div className="form-group">
                  <label>Digital Signature Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {config.signatureImage && (
                      <img
                        src={config.signatureImage}
                        alt="Signature"
                        style={{ height: 35, border: '1px solid #cbd5e1', padding: 2, borderRadius: 4 }}
                      />
                    )}
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                      <ImageIcon size={14} /> Upload Signature
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'signatureImage')}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {config.signatureImage && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setConfig((prev) => ({ ...prev, signatureImage: '' }))}
                        style={{ color: '#ef4444' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Company Stamp / Seal Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {config.stampImage && (
                      <img
                        src={config.stampImage}
                        alt="Stamp"
                        style={{ height: 35, border: '1px solid #cbd5e1', padding: 2, borderRadius: 4 }}
                      />
                    )}
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                      <Stamp size={14} /> Upload Stamp
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'stampImage')}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {config.stampImage && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setConfig((prev) => ({ ...prev, stampImage: '' }))}
                        style={{ color: '#ef4444' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Apply Letter Pad Layout
          </Button>
        </div>
      </form>
    </Modal>
  );
};

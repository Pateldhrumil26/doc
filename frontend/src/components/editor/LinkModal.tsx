import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { Link as LinkIcon, Trash2 } from 'lucide-react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  onSave: (url: string) => void;
  onRemove: () => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  initialUrl = '',
  onSave,
  onRemove,
}) => {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      let finalUrl = url.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }
      onSave(finalUrl);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Insert or Edit Link">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Destination Web URL</label>
          <div className="input-with-icon">
            <LinkIcon size={16} className="field-icon" />
            <input
              type="text"
              className="form-input icon-input"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
              required
            />
          </div>
        </div>

        <div className="modal-footer" style={{ margin: '20px -24px -24px -24px', justifyContent: 'space-between' }}>
          {initialUrl ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={<Trash2 size={14} />}
              onClick={() => {
                onRemove();
                onClose();
              }}
            >
              Remove Link
            </Button>
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Apply
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

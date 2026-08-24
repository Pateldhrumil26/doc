import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { PageOrientation, PageSize } from '../../types/document.types.js';

interface CreateDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    pageSize: PageSize;
    orientation: PageOrientation;
    folder: string;
    isLetterpadMode: boolean;
  }) => void;
  existingFolders?: string[];
}

export const CreateDocModal: React.FC<CreateDocModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title.trim() || 'Untitled Document',
      pageSize: 'A4',
      orientation: 'portrait',
      folder: 'General',
      isLetterpadMode: false,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Document">
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: 24 }}>
          <label htmlFor="doc-title-input" style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>
            Document Name
          </label>
          <input
            id="doc-title-input"
            type="text"
            className="form-input"
            placeholder="e.g. Untitled Document / Project Brief"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-footer" style={{ margin: '0 -24px -24px -24px' }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Document
          </Button>
        </div>
      </form>
    </Modal>
  );
};

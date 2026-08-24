import React, { useState } from 'react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { Dropdown } from '../common/Dropdown.js';
import { TemplateCategory } from '../../types/template.types.js';
import { LayoutTemplate, Stamp, Briefcase, FileText, Receipt, FileSpreadsheet } from 'lucide-react';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName: string;
  onSave: (data: { name: string; description: string; category: TemplateCategory }) => void;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  defaultName,
  onSave,
}) => {
  const [name, setName] = useState(defaultName ? `${defaultName} (Template)` : 'Custom Letterhead Template');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('letterpad');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        name: name.trim(),
        description: description.trim(),
        category,
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save as Reusable Template">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Template Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Official Executive Letterhead"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <Dropdown
            value={category}
            onChange={(val) => setCategory(val as TemplateCategory)}
            options={[
              { value: 'letterpad', label: 'Letter Pad / Letterhead', icon: <Stamp size={14} /> },
              { value: 'official', label: 'Official Document', icon: <FileText size={14} /> },
              { value: 'proposal', label: 'Business Proposal', icon: <Briefcase size={14} /> },
              { value: 'invoice', label: 'Invoice / Billing', icon: <Receipt size={14} /> },
              { value: 'memo', label: 'Memorandum', icon: <FileSpreadsheet size={14} /> },
              { value: 'custom', label: 'General Custom' },
            ]}
          />
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            className="form-textarea"
            placeholder="Short description of when to use this template..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<LayoutTemplate size={16} />}>
            Save Template
          </Button>
        </div>
      </form>
    </Modal>
  );
};

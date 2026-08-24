import React, { useState } from 'react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { Upload, Link as LinkIcon } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, alt?: string) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [preview, setPreview] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreview(reader.result);
          setUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onInsert(url, alt);
      setUrl('');
      setAlt('');
      setPreview('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Insert Image">
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
        <button
          type="button"
          className={`btn btn-ghost btn-sm ${tab === 'upload' ? 'active' : ''}`}
          onClick={() => setTab('upload')}
        >
          <Upload size={14} /> Upload from Computer
        </button>
        <button
          type="button"
          className={`btn btn-ghost btn-sm ${tab === 'url' ? 'active' : ''}`}
          onClick={() => setTab('url')}
        >
          <LinkIcon size={14} /> By Web URL
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {tab === 'upload' ? (
          <div className="form-group">
            <label>Select Image File (PNG, JPG, SVG, WebP)</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleFileUpload}
            />
            {preview && (
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 6 }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="form-group">
            <label>Image Web Address (URL)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/photo-..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Alt Text / Description (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Company Product Diagram"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
        </div>

        <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!url}>
            Insert Image
          </Button>
        </div>
      </form>
    </Modal>
  );
};

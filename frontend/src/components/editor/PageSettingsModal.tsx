import React, { useState } from 'react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { Dropdown } from '../common/Dropdown.js';
import { DocMargins, PageOrientation, PageSize } from '../../types/document.types.js';
import { Layout, Compass, Maximize2 } from 'lucide-react';

interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageSize: PageSize;
  orientation: PageOrientation;
  margins: DocMargins;
  zoom: number;
  onSave: (settings: {
    pageSize: PageSize;
    orientation: PageOrientation;
    margins: DocMargins;
    zoom: number;
  }) => void;
}

export const PageSettingsModal: React.FC<PageSettingsModalProps> = ({
  isOpen,
  onClose,
  pageSize: initialPageSize,
  orientation: initialOrientation,
  margins: initialMargins,
  zoom: initialZoom,
  onSave,
}) => {
  const [pageSize, setPageSize] = useState<PageSize>(initialPageSize);
  const [orientation, setOrientation] = useState<PageOrientation>(initialOrientation);
  const [margins, setMargins] = useState<DocMargins>(initialMargins);
  const [zoom, setZoom] = useState<number>(initialZoom);

  const handleMarginChange = (side: keyof Omit<DocMargins, 'unit'>, val: number) => {
    setMargins((prev) => ({ ...prev, [side]: val }));
  };

  const handlePresetMargins = (preset: 'normal' | 'narrow' | 'wide') => {
    if (preset === 'narrow') {
      setMargins({ top: 12.7, bottom: 12.7, left: 12.7, right: 12.7, unit: 'mm' });
    } else if (preset === 'wide') {
      setMargins({ top: 30, bottom: 30, left: 35, right: 35, unit: 'mm' });
    } else {
      setMargins({ top: 25, bottom: 25, left: 25, right: 25, unit: 'mm' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ pageSize, orientation, margins, zoom });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Page Setup & Margins">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>
              <Layout size={14} style={{ marginRight: 4 }} /> Paper Size
            </label>
            <Dropdown
              value={pageSize}
              onChange={(val) => setPageSize(val as PageSize)}
              options={[
                { value: 'A4', label: 'A4 (210 × 297 mm)', description: 'Standard international' },
                { value: 'Letter', label: 'Letter (8.5 × 11 in)', description: 'Standard US' },
                { value: 'Legal', label: 'Legal (8.5 × 14 in)', description: 'Formal legal' },
              ]}
            />
          </div>

          <div className="form-group">
            <label>
              <Compass size={14} style={{ marginRight: 4 }} /> Orientation
            </label>
            <Dropdown
              value={orientation}
              onChange={(val) => setOrientation(val as PageOrientation)}
              options={[
                { value: 'portrait', label: 'Portrait (Vertical)' },
                { value: 'landscape', label: 'Landscape (Horizontal)' },
              ]}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Margin Presets</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handlePresetMargins('normal')}
            >
              Normal (25mm)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handlePresetMargins('narrow')}
            >
              Narrow (12.7mm)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handlePresetMargins('wide')}
            >
              Wide (35mm)
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Margins ({margins.unit})</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Top</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                className="form-input"
                value={margins.top}
                onChange={(e) => handleMarginChange('top', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Bottom</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                className="form-input"
                value={margins.bottom}
                onChange={(e) =>
                  handleMarginChange('bottom', parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Left</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                className="form-input"
                value={margins.left}
                onChange={(e) => handleMarginChange('left', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Right</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                className="form-input"
                value={margins.right}
                onChange={(e) =>
                  handleMarginChange('right', parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>
            <Maximize2 size={14} style={{ marginRight: 4 }} /> Editor Canvas Zoom ({zoom}%)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="range"
              min="50"
              max="175"
              step="5"
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value, 10))}
              style={{ flex: 1 }}
            />
            <span style={{ fontWeight: 600, width: 45, textAlign: 'right' }}>{zoom}%</span>
          </div>
        </div>

        <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Apply Page Settings
          </Button>
        </div>
      </form>
    </Modal>
  );
};

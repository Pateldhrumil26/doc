import React from 'react';
import { Plus, Stamp, FileText, Briefcase, Receipt, FileSpreadsheet } from 'lucide-react';
import { TemplateItem } from '../../types/template.types.js';

interface TemplateGalleryProps {
  templates: TemplateItem[];
  onSelectBlank: () => void;
  onSelectTemplate: (template: TemplateItem) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  onSelectBlank,
  onSelectTemplate,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'letterpad':
        return <Stamp size={24} className="template-card-icon color-blue" />;
      case 'proposal':
        return <Briefcase size={24} className="template-card-icon color-indigo" />;
      case 'memo':
        return <FileText size={24} className="template-card-icon color-slate" />;
      case 'invoice':
        return <Receipt size={24} className="template-card-icon color-emerald" />;
      default:
        return <FileSpreadsheet size={24} className="template-card-icon color-purple" />;
    }
  };

  return (
    <section className="template-gallery-section">
      <div className="section-container">
        <div className="template-gallery-header">
          <h2>Start a new document</h2>
          <span className="template-gallery-badge">Letter Pad & Document Studio</span>
        </div>

        <div className="template-cards-grid">
          {/* Blank Document Card */}
          <div className="template-card blank-card" onClick={onSelectBlank}>
            <div className="blank-preview-box">
              <div className="plus-circle">
                <Plus size={32} />
              </div>
            </div>
            <div className="template-card-info">
              <span className="template-card-title">Blank Document</span>
              <span className="template-card-sub">Standard A4 page</span>
            </div>
          </div>

          {/* System & Custom Templates */}
          {templates.map((tpl) => (
            <div
              key={tpl._id}
              className="template-card"
              onClick={() => onSelectTemplate(tpl)}
            >
              <div className="template-preview-box">
                <div className="template-preview-inner">
                  {getCategoryIcon(tpl.category)}
                  <div className="template-preview-lines">
                    <div className="preview-line line-header" />
                    <div className="preview-line line-wide" />
                    <div className="preview-line line-medium" />
                    <div className="preview-line line-short" />
                  </div>
                </div>
              </div>
              <div className="template-card-info">
                <span className="template-card-title">{tpl.name}</span>
                <span className="template-card-sub">{tpl.category.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

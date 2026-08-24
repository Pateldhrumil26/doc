import React, { forwardRef } from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import {
  DocFooter,
  DocHeader,
  DocMargins,
  LetterpadConfig,
  PageOrientation,
  PageSize,
} from '../../types/document.types.js';
import { HeaderSection } from './HeaderSection.js';
import { FooterSection } from './FooterSection.js';
import {
  LetterpadMetaSection,
  LetterpadSignatorySection,
} from './LetterpadMetaSection.js';

interface PageCanvasProps {
  editor: Editor | null;
  pageSize: PageSize;
  orientation: PageOrientation;
  margins: DocMargins;
  zoom: number;
  header: DocHeader;
  footer: DocFooter;
  letterpadConfig: LetterpadConfig;
  onEditHeader: () => void;
  onEditFooter: () => void;
  onEditLetterpad: () => void;
}

export const PageCanvas = forwardRef<HTMLDivElement, PageCanvasProps>(
  (
    {
      editor,
      pageSize,
      orientation,
      margins,
      zoom,
      header,
      footer,
      letterpadConfig,
      onEditHeader,
      onEditFooter,
      onEditLetterpad,
    },
    ref
  ) => {
    // Content body margins
    const contentMarginStyle: React.CSSProperties = {
      paddingTop: header.enabled && header.layout === 'aesthetic' ? '12px' : `${margins.top}${margins.unit}`,
      paddingBottom: footer.enabled && footer.layout === 'aesthetic' ? '12px' : `${margins.bottom}${margins.unit}`,
      paddingLeft: `${margins.left}${margins.unit}`,
      paddingRight: `${margins.right}${margins.unit}`,
    };

    return (
      <div
        className="document-page-wrapper"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        <div
          id="printable-document-page"
          ref={ref}
          className={`document-page page-size-${pageSize} orientation-${orientation}`}
        >
          {/* Header Area */}
          <HeaderSection header={header} onEdit={onEditHeader} />

          {/* Document Content with Printable Margins */}
          <div className="document-page-inner-content" style={contentMarginStyle}>
            {/* Letter Pad Structured Recipient/Ref Block */}
            <LetterpadMetaSection
              config={letterpadConfig}
              onEdit={onEditLetterpad}
            />

            {/* TipTap Rich Text Editor Body */}
            <div className="document-body-content">
              <EditorContent editor={editor} />
            </div>

            {/* Letter Pad Signatory / Stamp Section */}
            <LetterpadSignatorySection
              config={letterpadConfig}
              onEdit={onEditLetterpad}
            />
          </div>

          {/* Footer Area */}
          <FooterSection footer={footer} onEdit={onEditFooter} />
        </div>
      </div>
    );
  }
);

PageCanvas.displayName = 'PageCanvas';

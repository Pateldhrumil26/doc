import { DocFooter, DocHeader, DocMargins, LetterpadConfig, PageOrientation, PageSize } from './document.types.js';

export type TemplateCategory = 'letterpad' | 'official' | 'invoice' | 'memo' | 'proposal' | 'custom';

export interface TemplateItem {
  _id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail?: string;
  content: string;
  header: DocHeader;
  footer: DocFooter;
  letterpadConfig: LetterpadConfig;
  pageSize: PageSize;
  orientation: PageOrientation;
  margins: DocMargins;
  isPublic: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateListResponse {
  success: boolean;
  count: number;
  data: {
    templates: TemplateItem[];
  };
}

export interface TemplateResponse {
  success: boolean;
  message?: string;
  data: {
    template: TemplateItem;
  };
}

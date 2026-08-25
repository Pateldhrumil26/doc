export type PageSize = 'A4' | 'Letter' | 'Legal' | 'Custom';
export type PageOrientation = 'portrait' | 'landscape';
export type HeaderLayout = 'classic' | 'modern' | 'minimal' | 'centered' | 'aesthetic';
export type FooterLayout = 'split' | 'centered' | 'simple' | 'aesthetic';

export interface DocMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
  unit: 'mm' | 'in' | 'px';
}

export interface CustomDimensions {
  width: number;
  height: number;
  unit: 'mm' | 'in' | 'px';
}

export interface DocHeader {
  enabled: boolean;
  logo?: string;
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  gst?: string;
  customText?: string;
  layout?: HeaderLayout;
  height?: number;
}

export interface DocFooter {
  enabled: boolean;
  customText?: string;
  showPageNumber?: boolean;
  showDate?: boolean;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  layout?: FooterLayout;
  height?: number;
}

export interface LetterpadConfig {
  isLetterpadMode: boolean;
  refNo?: string;
  date?: string;
  recipientName?: string;
  recipientDesignation?: string;
  recipientOrg?: string;
  recipientAddress?: string;
  subject?: string;
  regardsName?: string;
  regardsDesignation?: string;
  regardsOrg?: string;
  signatureImage?: string;
  stampImage?: string;
}

export interface DocumentItem {
  _id: string;
  title: string;
  content: string;
  header: DocHeader;
  footer: DocFooter;
  letterpadConfig: LetterpadConfig;
  pageSize: PageSize;
  customDimensions?: CustomDimensions;
  orientation: PageOrientation;
  margins: DocMargins;
  zoom: number;
  folder: string;
  createdBy: string;
  templateId?: string;
  isFavorite: boolean;
  isArchived: boolean;
  currentVersion?: string;
  versionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentResponse {
  success: boolean;
  message?: string;
  data: {
    document: DocumentItem;
  };
}

export interface DocumentListResponse {
  success: boolean;
  count: number;
  data: {
    documents: DocumentItem[];
    folders: string[];
  };
}

export interface DocumentVersion {
  _id: string;
  documentId: string;
  versionNumber: string; // e.g. 'v1.0', 'v1.1', 'v1.2'
  versionIndex: number;
  title: string;
  content: string;
  header: DocHeader;
  footer: DocFooter;
  letterpadConfig: LetterpadConfig;
  pageSize: PageSize;
  customDimensions?: CustomDimensions;
  orientation: PageOrientation;
  margins: DocMargins;
  zoom: number;
  changeSummary: string; // e.g. 'Initial document', 'Header changed', 'Text updated'
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersionListResponse {
  success: boolean;
  count: number;
  data: {
    versions: DocumentVersion[];
    currentVersion: string;
  };
}

export interface DocumentVersionResponse {
  success: boolean;
  message?: string;
  data: {
    version: DocumentVersion;
    document?: DocumentItem;
  };
}

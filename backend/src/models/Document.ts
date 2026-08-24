import mongoose, { Document as MongooseDocument, Schema, Types } from 'mongoose';

export interface IDocMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
  unit: 'mm' | 'in' | 'px';
}

export interface IDocHeader {
  enabled: boolean;
  logo?: string;
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  gst?: string;
  customText?: string;
  layout?: 'classic' | 'modern' | 'minimal' | 'centered' | 'aesthetic';
  height?: number;
}

export interface IDocFooter {
  enabled: boolean;
  customText?: string;
  showPageNumber?: boolean;
  showDate?: boolean;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  layout?: 'split' | 'centered' | 'simple' | 'aesthetic';
  height?: number;
}

export interface ILetterpadConfig {
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

export interface IDocument extends MongooseDocument {
  title: string;
  content: string;
  header: IDocHeader;
  footer: IDocFooter;
  letterpadConfig: ILetterpadConfig;
  pageSize: 'A4' | 'Letter' | 'Legal' | 'Custom';
  customDimensions?: {
    width: number;
    height: number;
    unit: 'mm' | 'in' | 'px';
  };
  orientation: 'portrait' | 'landscape';
  margins: IDocMargins;
  zoom: number;
  folder: string;
  createdBy: any;
  templateId?: Types.ObjectId;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a document title'],
      trim: true,
      default: 'Untitled Document',
    },
    content: {
      type: String,
      default: '<p></p>',
    },
    header: {
      enabled: { type: Boolean, default: false },
      logo: { type: String, default: '' },
      companyName: { type: String, default: '' },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      website: { type: String, default: '' },
      gst: { type: String, default: '' },
      customText: { type: String, default: '' },
      layout: {
        type: String,
        enum: ['classic', 'modern', 'minimal', 'centered', 'aesthetic'],
        default: 'classic',
      },
      height: { type: Number, default: 110 },
    },
    footer: {
      enabled: { type: Boolean, default: false },
      customText: { type: String, default: '' },
      showPageNumber: { type: Boolean, default: true },
      showDate: { type: Boolean, default: false },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      website: { type: String, default: '' },
      layout: {
        type: String,
        enum: ['split', 'centered', 'simple', 'aesthetic'],
        default: 'split',
      },
      height: { type: Number, default: 60 },
    },
    letterpadConfig: {
      isLetterpadMode: { type: Boolean, default: false },
      refNo: { type: String, default: '' },
      date: { type: String, default: '' },
      recipientName: { type: String, default: '' },
      recipientDesignation: { type: String, default: '' },
      recipientOrg: { type: String, default: '' },
      recipientAddress: { type: String, default: '' },
      subject: { type: String, default: '' },
      regardsName: { type: String, default: '' },
      regardsDesignation: { type: String, default: '' },
      regardsOrg: { type: String, default: '' },
      signatureImage: { type: String, default: '' },
      stampImage: { type: String, default: '' },
    },
    pageSize: {
      type: String,
      enum: ['A4', 'Letter', 'Legal', 'Custom'],
      default: 'A4',
    },
    customDimensions: {
      width: { type: Number, default: 210 },
      height: { type: Number, default: 297 },
      unit: { type: String, enum: ['mm', 'in', 'px'], default: 'mm' },
    },
    orientation: {
      type: String,
      enum: ['portrait', 'landscape'],
      default: 'portrait',
    },
    margins: {
      top: { type: Number, default: 25 },
      bottom: { type: Number, default: 25 },
      left: { type: Number, default: 25 },
      right: { type: Number, default: 25 },
      unit: { type: String, enum: ['mm', 'in', 'px'], default: 'mm' },
    },
    zoom: {
      type: Number,
      default: 100,
    },
    folder: {
      type: String,
      default: 'General',
      trim: true,
    },
    createdBy: {
      type: Schema.Types.Mixed,
      default: 'local_user',
      index: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

DocumentSchema.index({ updatedAt: -1 });
DocumentSchema.index({ folder: 1 });

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);

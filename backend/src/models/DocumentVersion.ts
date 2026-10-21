import mongoose, { Document as MongooseDocument, Schema, Types } from 'mongoose';
import { IDocHeader, IDocFooter, ILetterpadConfig, IDocMargins } from './Document.js';

export interface IDocumentVersion extends MongooseDocument {
  documentId: Types.ObjectId;
  versionNumber: string; // e.g. 'v1.0', 'v1.1', 'v1.2'
  versionIndex: number; // sequential counter 1, 2, 3...
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
  changeSummary: string; // e.g. 'Initial document', 'Header changed', 'Text updated', 'Footer changed'
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentVersionSchema = new Schema<IDocumentVersion>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    versionNumber: {
      type: String,
      required: true,
      default: 'v1.0',
    },
    versionIndex: {
      type: Number,
      required: true,
      default: 1,
    },
    title: {
      type: String,
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
        default: 'aesthetic',
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
        enum: ['aesthetic', 'modern', 'classic', 'minimal', 'split', 'centered', 'simple'],
        default: 'aesthetic',
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
      top: { type: Number, default: 20 },
      bottom: { type: Number, default: 20 },
      left: { type: Number, default: 20 },
      right: { type: Number, default: 20 },
      unit: { type: String, enum: ['mm', 'in', 'px'], default: 'mm' },
    },
    zoom: {
      type: Number,
      default: 100,
    },
    changeSummary: {
      type: String,
      default: 'Text updated',
    },
    createdBy: {
      type: String,
      default: 'local_user',
    },
  },
  {
    timestamps: true,
  }
);

export const DocumentVersionModel = mongoose.model<IDocumentVersion>(
  'DocumentVersion',
  DocumentVersionSchema
);

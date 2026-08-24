import mongoose, { Document as MongooseDocument, Schema, Types } from 'mongoose';
import { IDocFooter, IDocHeader, IDocMargins, ILetterpadConfig } from './Document.js';

export interface ITemplate extends MongooseDocument {
  name: string;
  description: string;
  category: 'letterpad' | 'official' | 'invoice' | 'memo' | 'proposal' | 'custom';
  thumbnail?: string;
  content: string;
  header: IDocHeader;
  footer: IDocFooter;
  letterpadConfig: ILetterpadConfig;
  pageSize: 'A4' | 'Letter' | 'Legal' | 'Custom';
  orientation: 'portrait' | 'landscape';
  margins: IDocMargins;
  isPublic: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: [true, 'Please provide template name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['letterpad', 'official', 'invoice', 'memo', 'proposal', 'custom'],
      default: 'custom',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
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
    isPublic: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const TemplateModel = mongoose.model<ITemplate>('Template', TemplateSchema);

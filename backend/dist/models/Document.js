"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DocumentSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.Mixed,
        default: 'local_user',
        index: true,
    },
    templateId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
DocumentSchema.index({ updatedAt: -1 });
DocumentSchema.index({ folder: 1 });
exports.DocumentModel = mongoose_1.default.model('Document', DocumentSchema);

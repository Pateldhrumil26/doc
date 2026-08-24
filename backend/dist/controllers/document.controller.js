"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameDocument = exports.duplicateDocument = exports.deleteDocument = exports.updateDocument = exports.getDocumentById = exports.getDocuments = exports.createDocument = void 0;
const Document_js_1 = require("../models/Document.js");
const error_middleware_js_1 = require("../middleware/error.middleware.js");
const createDocument = async (req, res, next) => {
    try {
        const { title, content, header, footer, letterpadConfig, pageSize, customDimensions, orientation, margins, zoom, folder, templateId, } = req.body;
        const defaultHeader = header || {
            enabled: false,
            companyName: '',
            logo: '',
            address: '',
            phone: '',
            email: '',
            website: '',
            gst: '',
            layout: 'classic',
        };
        const newDoc = await Document_js_1.DocumentModel.create({
            title: title || 'Untitled Document',
            content: content || '<p></p>',
            header: defaultHeader,
            footer: footer || {
                enabled: false,
                showPageNumber: true,
                showDate: false,
                layout: 'split',
            },
            letterpadConfig: letterpadConfig || {
                isLetterpadMode: false,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
            },
            pageSize: pageSize || 'A4',
            customDimensions,
            orientation: orientation || 'portrait',
            margins: margins || { top: 25, bottom: 25, left: 25, right: 25, unit: 'mm' },
            zoom: zoom || 100,
            folder: folder || 'General',
            templateId,
            createdBy: 'local_user',
        });
        res.status(201).json({
            success: true,
            message: 'Document created successfully',
            data: { document: newDoc },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createDocument = createDocument;
const getDocuments = async (req, res, next) => {
    try {
        const { search, folder, sort, archived } = req.query;
        const query = {
            isArchived: archived === 'true',
        };
        if (search && typeof search === 'string' && search.trim() !== '') {
            query.title = { $regex: search.trim(), $options: 'i' };
        }
        if (folder && typeof folder === 'string' && folder !== 'all') {
            query.folder = folder;
        }
        let sortOption = { updatedAt: -1 };
        if (sort === 'title') {
            sortOption = { title: 1 };
        }
        else if (sort === 'createdAt') {
            sortOption = { createdAt: -1 };
        }
        else if (sort === 'updatedAt_asc') {
            sortOption = { updatedAt: 1 };
        }
        const documents = await Document_js_1.DocumentModel.find(query).sort(sortOption).lean();
        // Get unique folders
        const folders = await Document_js_1.DocumentModel.distinct('folder');
        res.status(200).json({
            success: true,
            count: documents.length,
            data: {
                documents,
                folders: ['General', ...folders.filter((f) => f && f !== 'General')],
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDocuments = getDocuments;
const getDocumentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const document = await Document_js_1.DocumentModel.findById(id);
        if (!document) {
            throw new error_middleware_js_1.AppError('Document not found', 404);
        }
        res.status(200).json({
            success: true,
            data: { document },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDocumentById = getDocumentById;
const updateDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, header, footer, letterpadConfig, pageSize, customDimensions, orientation, margins, zoom, folder, isFavorite, isArchived, } = req.body;
        const document = await Document_js_1.DocumentModel.findByIdAndUpdate(id, {
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content }),
            ...(header !== undefined && { header }),
            ...(footer !== undefined && { footer }),
            ...(letterpadConfig !== undefined && { letterpadConfig }),
            ...(pageSize !== undefined && { pageSize }),
            ...(customDimensions !== undefined && { customDimensions }),
            ...(orientation !== undefined && { orientation }),
            ...(margins !== undefined && { margins }),
            ...(zoom !== undefined && { zoom }),
            ...(folder !== undefined && { folder }),
            ...(isFavorite !== undefined && { isFavorite }),
            ...(isArchived !== undefined && { isArchived }),
        }, { new: true, runValidators: true });
        if (!document) {
            throw new error_middleware_js_1.AppError('Document not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Document saved successfully',
            data: { document },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateDocument = updateDocument;
const deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const document = await Document_js_1.DocumentModel.findByIdAndDelete(id);
        if (!document) {
            throw new error_middleware_js_1.AppError('Document not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Document deleted successfully',
            data: { id: document._id },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDocument = deleteDocument;
const duplicateDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const originalDoc = await Document_js_1.DocumentModel.findById(id);
        if (!originalDoc) {
            throw new error_middleware_js_1.AppError('Original document not found', 404);
        }
        const duplicatedDoc = await Document_js_1.DocumentModel.create({
            title: `Copy of ${originalDoc.title}`,
            content: originalDoc.content,
            header: originalDoc.header,
            footer: originalDoc.footer,
            letterpadConfig: originalDoc.letterpadConfig,
            pageSize: originalDoc.pageSize,
            customDimensions: originalDoc.customDimensions,
            orientation: originalDoc.orientation,
            margins: originalDoc.margins,
            zoom: originalDoc.zoom,
            folder: originalDoc.folder,
            createdBy: 'local_user',
        });
        res.status(201).json({
            success: true,
            message: 'Document duplicated successfully',
            data: { document: duplicatedDoc },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.duplicateDocument = duplicateDocument;
const renameDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        if (!title || !title.trim()) {
            throw new error_middleware_js_1.AppError('Title cannot be empty', 400);
        }
        const document = await Document_js_1.DocumentModel.findByIdAndUpdate(id, { title: title.trim() }, { new: true });
        if (!document) {
            throw new error_middleware_js_1.AppError('Document not found', 404);
        }
        res.status(200).json({
            success: true,
            message: 'Document renamed successfully',
            data: { document },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.renameDocument = renameDocument;

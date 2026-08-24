import { Request, Response, NextFunction } from 'express';
import { DocumentModel } from '../models/Document.js';
import { AppError } from '../middleware/error.middleware.js';

export const createDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      content,
      header,
      footer,
      letterpadConfig,
      pageSize,
      customDimensions,
      orientation,
      margins,
      zoom,
      folder,
      templateId,
    } = req.body;

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

    const newDoc = await DocumentModel.create({
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
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, folder, sort, archived } = req.query;

    const query: any = {
      isArchived: archived === 'true',
    };

    if (search && typeof search === 'string' && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    if (folder && typeof folder === 'string' && folder !== 'all') {
      query.folder = folder;
    }

    let sortOption: any = { updatedAt: -1 };
    if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'createdAt') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'updatedAt_asc') {
      sortOption = { updatedAt: 1 };
    }

    const documents = await DocumentModel.find(query).sort(sortOption).lean();

    // Get unique folders
    const folders = await DocumentModel.distinct('folder');

    res.status(200).json({
      success: true,
      count: documents.length,
      data: {
        documents,
        folders: ['General', ...folders.filter((f) => f && f !== 'General')],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const document = await DocumentModel.findById(id);

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { document },
    });
  } catch (error) {
    next(error);
  }
};

export const updateDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      title,
      content,
      header,
      footer,
      letterpadConfig,
      pageSize,
      customDimensions,
      orientation,
      margins,
      zoom,
      folder,
      isFavorite,
      isArchived,
    } = req.body;

    const document = await DocumentModel.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true, runValidators: true }
    );

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Document saved successfully',
      data: { document },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const document = await DocumentModel.findByIdAndDelete(id);

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      data: { id: document._id },
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const originalDoc = await DocumentModel.findById(id);

    if (!originalDoc) {
      throw new AppError('Original document not found', 404);
    }

    const duplicatedDoc = await DocumentModel.create({
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
  } catch (error) {
    next(error);
  }
};

export const renameDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      throw new AppError('Title cannot be empty', 400);
    }

    const document = await DocumentModel.findByIdAndUpdate(
      id,
      { title: title.trim() },
      { new: true }
    );

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Document renamed successfully',
      data: { document },
    });
  } catch (error) {
    next(error);
  }
};

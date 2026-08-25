import { Request, Response, NextFunction } from 'express';
import { DocumentModel } from '../models/Document.js';
import { DocumentVersionModel } from '../models/DocumentVersion.js';
import { AppError } from '../middleware/error.middleware.js';

// Helper function to auto-detect change summary between versions
const detectChangeSummary = (existing: any, updates: any): string => {
  if (updates.changeSummary && typeof updates.changeSummary === 'string' && updates.changeSummary.trim()) {
    return updates.changeSummary.trim();
  }

  const changes: string[] = [];

  // Check header
  if (updates.header !== undefined) {
    const prevHeader = existing.header || {};
    const nextHeader = updates.header || {};
    if (
      prevHeader.logo !== nextHeader.logo ||
      prevHeader.companyName !== nextHeader.companyName ||
      prevHeader.enabled !== nextHeader.enabled ||
      prevHeader.layout !== nextHeader.layout
    ) {
      changes.push('Header changed');
    }
  }

  // Check footer
  if (updates.footer !== undefined) {
    const prevFooter = existing.footer || {};
    const nextFooter = updates.footer || {};
    if (
      prevFooter.phone !== nextFooter.phone ||
      prevFooter.email !== nextFooter.email ||
      prevFooter.website !== nextFooter.website ||
      prevFooter.address !== nextFooter.address ||
      prevFooter.enabled !== nextFooter.enabled ||
      prevFooter.layout !== nextFooter.layout
    ) {
      changes.push('Footer changed');
    }
  }

  // Check letterpad config
  if (updates.letterpadConfig !== undefined) {
    const prevLp = existing.letterpadConfig || {};
    const nextLp = updates.letterpadConfig || {};
    if (
      prevLp.refNo !== nextLp.refNo ||
      prevLp.subject !== nextLp.subject ||
      prevLp.recipientName !== nextLp.recipientName ||
      prevLp.isLetterpadMode !== nextLp.isLetterpadMode
    ) {
      changes.push('Letter pad updated');
    }
  }

  // Check page setup
  if (
    (updates.pageSize !== undefined && updates.pageSize !== existing.pageSize) ||
    (updates.orientation !== undefined && updates.orientation !== existing.orientation) ||
    (updates.margins !== undefined && JSON.stringify(updates.margins) !== JSON.stringify(existing.margins))
  ) {
    changes.push('Page layout changed');
  }

  // Check content
  if (updates.content !== undefined && updates.content !== existing.content) {
    changes.push('Text updated');
  }

  // Check title
  if (updates.title !== undefined && updates.title !== existing.title) {
    changes.push('Title updated');
  }

  if (changes.length === 0) {
    return 'Document updated';
  }

  return changes.join(', ');
};

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
      layout: 'aesthetic',
    };

    const newDoc = await DocumentModel.create({
      title: title || 'Untitled Document',
      content: content || '<p></p>',
      header: defaultHeader,
      footer: footer || {
        enabled: false,
        showPageNumber: true,
        showDate: false,
        layout: 'aesthetic',
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
      margins: margins || { top: 20, bottom: 20, left: 20, right: 20, unit: 'mm' },
      zoom: zoom || 100,
      folder: folder || 'General',
      templateId,
      createdBy: 'local_user',
      currentVersion: 'v1.0',
      versionCount: 1,
    });

    // Create Initial Version v1.0
    await DocumentVersionModel.create({
      documentId: newDoc._id,
      versionNumber: 'v1.0',
      versionIndex: 1,
      title: newDoc.title,
      content: newDoc.content,
      header: newDoc.header,
      footer: newDoc.footer,
      letterpadConfig: newDoc.letterpadConfig,
      pageSize: newDoc.pageSize,
      customDimensions: newDoc.customDimensions,
      orientation: newDoc.orientation,
      margins: newDoc.margins,
      zoom: newDoc.zoom,
      changeSummary: 'Initial document',
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

    const existingDoc = await DocumentModel.findById(id);
    if (!existingDoc) {
      throw new AppError('Document not found', 404);
    }

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
      changeSummary: explicitSummary,
    } = req.body;

    const hasSignificantChanges =
      (title !== undefined && title !== existingDoc.title) ||
      (content !== undefined && content !== existingDoc.content) ||
      (header !== undefined && JSON.stringify(header) !== JSON.stringify(existingDoc.header)) ||
      (footer !== undefined && JSON.stringify(footer) !== JSON.stringify(existingDoc.footer)) ||
      (letterpadConfig !== undefined &&
        JSON.stringify(letterpadConfig) !== JSON.stringify(existingDoc.letterpadConfig)) ||
      (pageSize !== undefined && pageSize !== existingDoc.pageSize) ||
      (orientation !== undefined && orientation !== existingDoc.orientation) ||
      (margins !== undefined && JSON.stringify(margins) !== JSON.stringify(existingDoc.margins));

    let nextVersionNumber = existingDoc.currentVersion || 'v1.0';
    let nextVersionIndex = existingDoc.versionCount || 1;

    if (hasSignificantChanges) {
      nextVersionIndex += 1;
      nextVersionNumber = `v1.${nextVersionIndex - 1}`;
    }

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
        currentVersion: nextVersionNumber,
        versionCount: nextVersionIndex,
      },
      { new: true, runValidators: true }
    );

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // Save historical version snapshot if there are significant changes
    if (hasSignificantChanges) {
      const computedSummary = detectChangeSummary(existingDoc, {
        title,
        content,
        header,
        footer,
        letterpadConfig,
        pageSize,
        orientation,
        margins,
        changeSummary: explicitSummary,
      });

      await DocumentVersionModel.create({
        documentId: document._id,
        versionNumber: nextVersionNumber,
        versionIndex: nextVersionIndex,
        title: document.title,
        content: document.content,
        header: document.header,
        footer: document.footer,
        letterpadConfig: document.letterpadConfig,
        pageSize: document.pageSize,
        customDimensions: document.customDimensions,
        orientation: document.orientation,
        margins: document.margins,
        zoom: document.zoom,
        changeSummary: computedSummary,
        createdBy: 'local_user',
      });
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

    // Clean up all versions for this document
    await DocumentVersionModel.deleteMany({ documentId: id });

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
      currentVersion: 'v1.0',
      versionCount: 1,
    });

    // Create Initial Version v1.0 for the duplicated doc
    await DocumentVersionModel.create({
      documentId: duplicatedDoc._id,
      versionNumber: 'v1.0',
      versionIndex: 1,
      title: duplicatedDoc.title,
      content: duplicatedDoc.content,
      header: duplicatedDoc.header,
      footer: duplicatedDoc.footer,
      letterpadConfig: duplicatedDoc.letterpadConfig,
      pageSize: duplicatedDoc.pageSize,
      customDimensions: duplicatedDoc.customDimensions,
      orientation: duplicatedDoc.orientation,
      margins: duplicatedDoc.margins,
      zoom: duplicatedDoc.zoom,
      changeSummary: 'Duplicated from ' + originalDoc.title,
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

// ==========================================
// DOCUMENT VERSIONING CONTROLLERS
// ==========================================

export const createVersion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { changeSummary } = req.body;

    const document = await DocumentModel.findById(id);
    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const nextIndex = (document.versionCount || 1) + 1;
    const nextVersionNumber = `v1.${nextIndex - 1}`;

    const newVersion = await DocumentVersionModel.create({
      documentId: document._id,
      versionNumber: nextVersionNumber,
      versionIndex: nextIndex,
      title: document.title,
      content: document.content,
      header: document.header,
      footer: document.footer,
      letterpadConfig: document.letterpadConfig,
      pageSize: document.pageSize,
      customDimensions: document.customDimensions,
      orientation: document.orientation,
      margins: document.margins,
      zoom: document.zoom,
      changeSummary: changeSummary || 'Manual snapshot saved',
      createdBy: 'local_user',
    });

    document.currentVersion = nextVersionNumber;
    document.versionCount = nextIndex;
    await document.save();

    res.status(201).json({
      success: true,
      message: `Version ${nextVersionNumber} created successfully`,
      data: { version: newVersion, document },
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentVersions = async (
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

    let versions = await DocumentVersionModel.find({ documentId: id })
      .sort({ createdAt: -1 })
      .lean();

    // If no historical version exists yet (e.g. created prior to versioning), seed v1.0
    if (versions.length === 0) {
      const initialVer = await DocumentVersionModel.create({
        documentId: document._id,
        versionNumber: 'v1.0',
        versionIndex: 1,
        title: document.title,
        content: document.content,
        header: document.header,
        footer: document.footer,
        letterpadConfig: document.letterpadConfig,
        pageSize: document.pageSize,
        customDimensions: document.customDimensions,
        orientation: document.orientation,
        margins: document.margins,
        zoom: document.zoom,
        changeSummary: 'Initial document',
        createdBy: 'local_user',
      });
      versions = [initialVer.toObject() as any];
    }

    res.status(200).json({
      success: true,
      count: versions.length,
      data: {
        versions,
        currentVersion: document.currentVersion || 'v1.0',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getVersionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, versionId } = req.params;

    const version = await DocumentVersionModel.findOne({
      _id: versionId,
      documentId: id,
    });

    if (!version) {
      throw new AppError('Document version not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { version },
    });
  } catch (error) {
    next(error);
  }
};

export const restoreVersion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, versionId } = req.params;

    const document = await DocumentModel.findById(id);
    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const versionToRestore = await DocumentVersionModel.findOne({
      _id: versionId,
      documentId: id,
    });

    if (!versionToRestore) {
      throw new AppError('Version to restore not found', 404);
    }

    // Increment version count for the new restored snapshot
    const nextIndex = (document.versionCount || 1) + 1;
    const nextVersionNumber = `v1.${nextIndex - 1}`;
    const restoreSummary = `Restored from ${versionToRestore.versionNumber}`;

    // Update active document with the restored state
    document.title = versionToRestore.title || document.title;
    document.content = versionToRestore.content;
    document.header = versionToRestore.header;
    document.footer = versionToRestore.footer;
    document.letterpadConfig = versionToRestore.letterpadConfig;
    document.pageSize = versionToRestore.pageSize;
    document.customDimensions = versionToRestore.customDimensions;
    document.orientation = versionToRestore.orientation;
    document.margins = versionToRestore.margins;
    document.zoom = versionToRestore.zoom || 100;
    document.currentVersion = nextVersionNumber;
    document.versionCount = nextIndex;
    await document.save();

    // Create a NEW version record without deleting existing history
    const restoredNewVersion = await DocumentVersionModel.create({
      documentId: document._id,
      versionNumber: nextVersionNumber,
      versionIndex: nextIndex,
      title: document.title,
      content: document.content,
      header: document.header,
      footer: document.footer,
      letterpadConfig: document.letterpadConfig,
      pageSize: document.pageSize,
      customDimensions: document.customDimensions,
      orientation: document.orientation,
      margins: document.margins,
      zoom: document.zoom,
      changeSummary: restoreSummary,
      createdBy: 'local_user',
    });

    res.status(200).json({
      success: true,
      message: `Document restored successfully to ${versionToRestore.versionNumber} (created ${nextVersionNumber})`,
      data: {
        document,
        version: restoredNewVersion,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVersion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, versionId } = req.params;

    const count = await DocumentVersionModel.countDocuments({ documentId: id });
    if (count <= 1) {
      throw new AppError('Cannot delete the only remaining version of this document.', 400);
    }

    const version = await DocumentVersionModel.findOneAndDelete({
      _id: versionId,
      documentId: id,
    });

    if (!version) {
      throw new AppError('Version not found', 404);
    }

    // If deleted version was currentVersion, point to latest remaining version
    const document = await DocumentModel.findById(id);
    if (document && document.currentVersion === version.versionNumber) {
      const latestRemaining = await DocumentVersionModel.findOne({ documentId: id }).sort({
        createdAt: -1,
      });
      if (latestRemaining) {
        document.currentVersion = latestRemaining.versionNumber;
        await document.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Version ${version.versionNumber} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};


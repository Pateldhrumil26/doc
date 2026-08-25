import { Router } from 'express';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  duplicateDocument,
  renameDocument,
  createVersion,
  getDocumentVersions,
  getVersionById,
  restoreVersion,
  deleteVersion,
} from '../controllers/document.controller.js';

const router = Router();

// Base Document CRUD
router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

// Document Utilities
router.post('/:id/duplicate', duplicateDocument);
router.put('/:id/rename', renameDocument);

// Document Versioning Routes
router.post('/:id/versions', createVersion);
router.get('/:id/versions', getDocumentVersions);
router.get('/:id/versions/:versionId', getVersionById);
router.post('/:id/versions/:versionId/restore', restoreVersion);
router.delete('/:id/versions/:versionId', deleteVersion);

export default router;
